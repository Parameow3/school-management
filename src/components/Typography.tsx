import React from 'react'
interface TypographyProps {
    className?: string;
    text?: 'primary' | 'secondary';
    fontsize?: '24px' | '16px' | '15px' | '14px';
    children?: string;
}
const Typography: React.FC<TypographyProps> = ({
    className,
    text = 'default',
    children,
    fontsize = '14px',
}) => {
    const Typographytext = (text: string) => {
        switch (text) {
            case 'primary':
                return "text-[#213458]";
            case 'secondary':
                return "text-[#213458]";
            default:
                return 'text-[#FFFFFF]';
        }
    };
    const Typographyfont = (fontsize: String) => {
        switch (fontsize) {
            case "24px":
                return "text-[24px]";
            case '16px':
                return "text-[16px]";
            case '15px':
                return "text-[15px]";
            case '14px':
                return "text-[14px]";
            default:
                return "text-xs";
        }
    };
    const TypographybgStyle = Typographytext(text);
    const TypographyfontStyle = Typographyfont(fontsize);
    return (
        <div>
            <p className={`${TypographybgStyle} ${TypographyfontStyle} ${className}`}>
                {children}
            </p>
        </div>
    );
}
export default Typography;
