import { Skeleton } from "@heroui/react"
import { ReactNode } from "react"

type LoadingComponentProps={
    isLoading:boolean,
    children:ReactNode
}
export function LoadingComponent({children,isLoading}:LoadingComponentProps){

    return (
        <Skeleton isLoaded={isLoading}>{children}</Skeleton>
    )
}