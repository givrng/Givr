import { useCallback, useEffect, useRef, useState, } from "react";
import { InputArea, MessageBubble, ThreadHeader, type Message } from "./inAppChatComponents";
import { useVerifyAuth } from "../Auth/AuthContext";
import useAuthFetch from "../hooks/useAuthFetch";
import type { ProjectProps, UserTypes } from "../../interface/interfaces";
import { LoadingEffect } from "../icons";
import { useSocketConnection } from "./socketConnection";

type Event = "Message"| "Group_Opened"|"Group_Closed"|"Connected";
export interface ClientEvent {
  type: Event;
  payload: Message
}

// interface PageInfo{
//   isLast:boolean;
//   pageNumber: number;

// }
const useMessageThread= ()=>{

    const [isOpen, setIsOpen] = useState(false)
    // const [hasMore, setHasMore] = useState(false)
    const [project, setProject] = useState<ProjectProps>({
      applicationDeadline: '',
      attendanceHours:{
        from: "",
        to:""
      },
      categories: [],
      endDate: "",
      id:0,
      location: {lga:"", state:""},
      maxVolunteers: 0,
      requiredSkills: [], 
      startDate: "",
      status: "OPEN",
      specialRequirements: "",
      title: "",
      totalApplicants: 0
    })
    const [userType, setUsetType] = useState<UserTypes>("organization")
    const [customClose, setCustomClose] = useState<(()=>void)|null>(null)

    // const sockConnection = useSocketConnection()

    const sockConnection = useSocketConnection()
    const isConnected = !!sockConnection?.socketConnection

    const MessageThread:React.FC<{project:ProjectProps, userType: UserTypes, onClose: ()=>void}>= ({project, userType, onClose}) =>{

      const [messages, setMessages] = useState<Message[]>([])
      const [isLoading, setIsLoading] = useState(false)
      const [hasMore, setHasMore] = useState(false)
      

      const {API} = useAuthFetch(userType)
      const verifyAuth = useVerifyAuth();
      

      let projectId = project.id;
      let title = project.title
      
      const observerTargetRef = useRef<HTMLDivElement|null>(null)
      const containerRef = useRef<HTMLDivElement|null>(null)
      const scrollRef = useRef<HTMLDivElement>(null);

      const handleRef = (ex: HTMLDivElement)=>{
        scrollRef.current = ex
        containerRef.current = ex
      }
      const loadConversation = async (getOld:boolean)=>{
        if(!verifyAuth?.isAuthenticated){
          return;
        }

        try{
          setIsLoading(true)
          let response = !getOld? await API().get(`/chat/${projectId}/history`): await  API().get(`/chat/${projectId}/history?cursor=${messages[0].msgId}`)
          let totalElements = response.data.page.totalElements as number
          let size = response.data.page.size as number

          setHasMore(size < totalElements)
          let msgs:Message[] = response.data.content as Message[];
          msgs.reverse()
          
          if(getOld)
            setMessages(prev=>([...msgs, ...prev]))
          else  
            setMessages(msgs)
        }finally{
          setIsLoading(false)
        }
      }
      
      const handleMessageNotification = (msgEvent: MessageEvent)=>{
        let msg = JSON.parse(msgEvent.data) as Message
        
        if(msg && msg.type=="chat_message"){
          setMessages(prev=>[...prev, msg])
          if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        }
      }
      

      useEffect(() => {

        (async()=>{
          await loadConversation(false)
        })()
        
        if(!isConnected) return;
        
        if(!sockConnection?.socketConnection)
          return
      
        sockConnection.socketConnection?.addEventListener("message", handleMessageNotification)
        sockConnection.subscribe(projectId)
        // sockConnection.clearUnread(projectId)

        return ()=>{
          let socket = sockConnection?.socketConnection
            if(socket && socket.readyState==socket.OPEN){
              sockConnection.unsubscribe(projectId)
              socket.removeEventListener("message", handleMessageNotification)
          }
        }
      }, [isConnected, projectId]);


      useEffect(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
          });
        }, [messages]);


      useEffect(()=>{
       
        if(!containerRef.current || !observerTargetRef.current)
          return;

        const observer = new IntersectionObserver(
          async ([entries])=>{
            if(entries.isIntersecting && hasMore && !isLoading){
              const container = containerRef.current
              if(!container)return;

              const previousHeight = container?.scrollHeight
              await loadConversation(true)

              requestAnimationFrame(()=>{
                const newHeight = container?.scrollHeight;
                
                container.scrollTop += (newHeight - previousHeight)
              })
            }
          },
          {root: containerRef.current, threshold: 0.1}
        );

        if(observerTargetRef.current){
          observer.observe(observerTargetRef.current)
        }

        return ()=>observer.disconnect()
      }, [hasMore, isLoading, messages])

      async function handleSend(txt: string) {
        let payload: ClientEvent = {
          type: "Message",
          payload: {
            content: txt,
            projectId
          }
        };
        
        sockConnection?.send(payload)
      }

      if(!isOpen)
        return null
  
      return (
        <div className="flex flex-col h-svh bg-white font-sans text-slate-900 overflow-hidden w-full mx-auto shadow-2xl" 
        >
          {isLoading && <LoadingEffect message="Loading Conversation"/>}
          <ThreadHeader newMessageCount={3} title={title} onClose={onClose}/>
          
          <div 
            ref={handleRef}
            className="flex-grow overflow-y-auto p-6 space-y-4 scroll-smooth"
          >
            <div ref={observerTargetRef} className="h-1"></div>
            {messages.map((msg) => (
              <MessageBubble key={msg.msgId} message={msg}/>
            ))}
          </div>

          <InputArea onSend={handleSend} variant={userType}/>
        </div>
      );
  }

  const openGroupMessage = useCallback((project:ProjectProps, userType:UserTypes, customClose?:()=>void)=>{
    setIsOpen(true)
    setProject(project)
    setUsetType(userType)
    setCustomClose(()=>customClose||null)
    
  }, [])


   const closeModal = useCallback(()=>{
    if(customClose)
      customClose()
    setIsOpen(false)
   }, [customClose])

   const GroupMessageComp = ()=>(<MessageThread project={project} userType={userType} onClose={closeModal}/>)

   return {openGroupMessage, GroupMessageComp}
}

export default useMessageThread;