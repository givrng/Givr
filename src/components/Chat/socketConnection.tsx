import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { ClientEvent } from "./MessageThread";
import type { Message } from "./inAppChatComponents";


interface SocketConnectionProperties {
    socketConnection: WebSocket|null;
    subscribe: (projectId:number)=>void;
    unsubscribe: (projectId:number)=>void;
    unreadCount: Map<number, number>|null;
    totalCount: number
    send: (msg:ClientEvent)=>void;
}


const SocketConnectionContext = createContext<SocketConnectionProperties| undefined>(undefined)

export const WebsocketConnection:React.FC<{children:React.ReactNode}> = ({children})=>{

    const socketRef = useRef<WebSocket|null>(null)
    const reconnectionTimeoutRef = useRef<number|null>(null)
    const messageQueue = useRef<ClientEvent[]>([])
    const reconnectAttempts = useRef(0)
    const manuallyClosed = useRef(false)


    let subscriptions = useRef<Map<number, number>>(new Map())
    let totalUnread = useRef<number>(0)
    
    const [socketConnection, setSocketConnection] = useState<WebSocket|null>(null)
    const [unreadCount, setUnreadCount] = useState<Map<number, number>>(new Map())
    const [totalCount, setTotalCount] = useState<number>(0)

    const socketBaseUrl = import.meta.env.VITE_CHAT_BASEURL;

    const notificationSound = useRef(new Audio("/sound/notify.mp3"))

    const playNotification = ()=>{
        notificationSound.current.currentTime = 0
        notificationSound.current.play()
    }
    
    const connect =()=>{

        if(manuallyClosed.current)
            return;

        console.log("Connecting socket...")

        let socket = new WebSocket(`${socketBaseUrl}/chat`)
        
        let connectMsg: ClientEvent = {
            type: "Connected",
            payload:{}
        }
        socketRef.current = socket;
        
        
        socket.onopen = ()=>{
            
            console.log("Connection open")
            reconnectAttempts.current = 0
            socket.send(JSON.stringify(connectMsg))
            setSocketConnection(socket)

            // restore previous connections on reconnect
            subscriptions.current.forEach((count, projectId)=>{
                if(count > 0){
                    socket.send(
                        JSON.stringify({
                            type: "Group_Opened",
                            payload: {projectId}
                        })
                    )
                }
            })

            
            while(messageQueue.current.length > 0){
                let msg = messageQueue.current.shift()
                if(msg)
                    socket.send(JSON.stringify(msg))
            }
        }

        socket.onclose = (ev: CloseEvent)=>{
            console.error("Socket closed", ev.code, ev.reason)
            setSocketConnection(null)

            if(manuallyClosed.current)
                return

            reconnectAttempts.current++

            // exponential backoff
            const delay = Math.min(1000* 2** reconnectAttempts.current, 30000)
            
            console.log(`Reconnecting in ${delay}ms`)

            reconnectionTimeoutRef.current = window.setTimeout(()=>{
                // connect

                // connect()
            }, delay)

        }

        socket.onmessage= (msg)=>{
            let payload = JSON.parse(msg.data) as Message
           
            if(payload.type == "unread_update" && payload.projectId){
                let projectId = payload.projectId
                totalUnread.current++
                setTotalCount(totalUnread.current)
                playNotification()
                setUnreadCount(prev=>{
                    let next = new Map(prev)
                    next.set(projectId, (next.get(projectId)||0)+1)

                    return next;
                })
            }
        }

        socket.onerror=  (err)=>{
            console.error("Error occured", err)
        }
    }

    useEffect(()=>{
        manuallyClosed.current = false
        connect()
        return ()=>{
            manuallyClosed.current = true

            if(reconnectionTimeoutRef.current){
                clearTimeout(reconnectionTimeoutRef.current)
            }

            socketRef.current?.close()
            socketRef.current = null

        }
            
    }, [])

    const subscribe = useCallback((projectId:number)=>{
        let sock = socketRef.current

        let count = subscriptions.current?.get(projectId) || 0

        subscriptions.current?.set(projectId, count+1)

        if(count === 0 && sock?.readyState === WebSocket.OPEN){
            sock?.send(JSON.stringify({
            type: "Group_Opened", 
            payload: {
                projectId
            }
        }))
            
        }

         setUnreadCount((prev)=>{
            if ((prev.get(projectId) || 0) === 0) return prev;
            const next = new Map(prev);
            next.set(projectId, 0);
            return next;
        })
    }, [])


    const unsubscribe = useCallback((projectId:number)=>{
            let subscriptionMsg: ClientEvent = {
                type: "Group_Closed", 
                payload: {
                    projectId
                }
            }

            const sock = socketRef.current;

            let count = (subscriptions.current?.get(projectId) || 0) - 1
        

            if(count < 0)
                return
            
        
            if(count == 0 && sock?.readyState===WebSocket.OPEN){
                setTimeout(()=>{
                    if(subscriptions.current?.get(projectId) == 0){
                        sock?.send(JSON.stringify(subscriptionMsg))
                    }
                        
                }, 50)
            }
            subscriptions.current.set(projectId, count)
        }, [])
    
        function send(payload: ClientEvent) {
            let sock = socketRef.current;

            if (sock && sock.readyState == WebSocket.OPEN){
                sock.send(JSON.stringify(payload));
                return
            }else
                messageQueue.current.push(payload)
        }

        const value = useMemo<SocketConnectionProperties>(()=>({
            send,
            socketConnection,
            subscribe, 
            totalCount,
            unreadCount,
            unsubscribe
        }), [socketConnection, send, subscribe, unsubscribe, totalCount, unreadCount])

    return <SocketConnectionContext.Provider value={value}>
        {children}
    </SocketConnectionContext.Provider>
}

export const useSocketConnection = ()=>useContext(SocketConnectionContext)