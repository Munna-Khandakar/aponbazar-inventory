"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Maximize2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type FullscreenTableCardProps = {
  id?: string
  title: string
  description: string
  fullscreenTitle?: string
  fullscreenDescription?: string
  children: ReactNode
  fullscreenChildren?: ReactNode
  bodyClassName?: string
  fullscreenBodyClassName?: string
  className?: string
  fullscreenDisabled?: boolean
}

export function FullscreenTableCard({
  id,
  title,
  description,
  fullscreenTitle,
  fullscreenDescription,
  children,
  fullscreenChildren,
  bodyClassName,
  fullscreenBodyClassName,
  className,
  fullscreenDisabled = false,
}: FullscreenTableCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!isFullscreen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isFullscreen])

  return (
    <>
      <Card id={id} className={className}>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={fullscreenDisabled}
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 size={15} />
            Full Screen
          </Button>
        </CardHeader>
        <CardContent className={bodyClassName}>{children}</CardContent>
      </Card>

      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex h-full w-full flex-col rounded-3xl border border-border/70 bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {fullscreenTitle ?? title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {fullscreenDescription ?? description}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsFullscreen(false)}
              >
                <X size={15} />
                Close
              </Button>
            </div>
            <div className={fullscreenBodyClassName ?? "min-h-0 flex-1 overflow-auto px-5 py-4"}>
              {fullscreenChildren ?? children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
