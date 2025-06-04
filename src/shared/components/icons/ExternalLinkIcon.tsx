import { cn } from "@/shared/utils/cn";

const ExternalLinkIcon = ({ className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 15"
      fill="none"
      className={cn("size-4", className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 2c-.5523 0-1 .4477-1 1v9c0 .5523.4477 1 1 1h9c.5523 0 1-.4477 1-1V8.5a.5.5 0 0 0-1 0V12H3V3h3.5a.5.5 0 0 0 0-1H3Zm9.8536.1465A.4991.4991 0 0 1 13 2.497V5.5a.5.5 0 0 1-1 0V3.7071L6.8536 8.8535a.5.5 0 1 1-.7072-.707L11.293 3H9.5a.5.5 0 0 1 0-1h3a.4986.4986 0 0 1 .3536.1465Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default ExternalLinkIcon;
