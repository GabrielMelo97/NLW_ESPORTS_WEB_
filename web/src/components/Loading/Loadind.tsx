import { CircleNotch } from "phosphor-react";

export function Loading(){
  return(
    <div 
      className="fixed top-0 flex justify-center items-center h-full w-full bg-[rgba(0,0,0,0.8)] z-10"
    >
      <CircleNotch 
        size={52} 
        color="#fff" 
        weight="duotone"
        
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 0 0"
          to="360 0 0"
          repeatCount="indefinite"
        ></animateTransform>
      </CircleNotch>
    </div>
  )
}