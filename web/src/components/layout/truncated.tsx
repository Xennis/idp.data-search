import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export const TruncatedString = ({ value, maxLength }: { value: string; maxLength: number }) => {
  if (value.length <= maxLength) {
    return <span>{value}</span>
  }
  return (
    <Tooltip>
      <TooltipTrigger>
        <span>{value.slice(0, maxLength)}...</span>
      </TooltipTrigger>
      <TooltipContent>{value}</TooltipContent>
    </Tooltip>
  )
}

export const TruncatedBadges = ({
  values,
  maxBadges,
  maxStringLength,
}: {
  values: string[]
  maxBadges: number
  maxStringLength: number
}) => {
  return (
    <div className="flex flex-row gap-0.5">
      {values.slice(0, maxBadges).map((value, index) => (
        <Badge key={index} variant="outline">
          <TruncatedString value={value} maxLength={maxStringLength} />
        </Badge>
      ))}
      {values.length > 7 ? (
        <Tooltip>
          <TooltipTrigger>
            <Badge key="more" variant="outline">
              ...
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{values.slice(maxBadges).join(", ")}</TooltipContent>
        </Tooltip>
      ) : (
        ""
      )}
    </div>
  )
}
