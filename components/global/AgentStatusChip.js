import { Chip } from "@mui/material";
import { useEffect, useState } from "react";

const AgentStatusChip = ({ status }) => {
    const [bgColor, setBgColor] = useState("#F5F5F5");
    const [color, setColor] = useState("#C3C3C3");
    useEffect(() => {
        switch (status?.toLowerCase()) {
            case "active":
                setBgColor("#F1F9F1");
                setColor("#4CAF50");
                break;
            case "inactive":
                setBgColor("#F5F5F5");
                setColor("#C3C3C3");
                break;
            case "on leave":
                setBgColor("#FEF3EB");
                setColor("#EE7410");
                break;
            case "onboarding":
                setBgColor("#F0F1F9");
                setColor("#3F51B5");
                break;
            case "interviewing":
                setBgColor("#FEEBF2");
                setColor("#FF4081");
                break;
            case "hired":
                setBgColor("green");
                setColor("white");
                break;
            case "rejected":
                setBgColor("red");
                setColor("white");
                break;
            case "ended":
                setBgColor("crimson");
                setColor("white");
                break;
            case "new":
                setBgColor("chocolate");
                setColor("white");
                break;
            case "open":
                setBgColor("dodgerblue");
                setColor("white");
                break;
            case 'succeeded':
                setBgColor("#4CAF50");
                setColor("white");
                break;
            case "paid":
                setBgColor("#4CAF50");
                setColor("white");
                break;
            case "void":
                setBgColor("crimson");
                setColor("white");
                break;
            case "past due":
                setBgColor("#F44336");
                setColor("white");
                break;
            default:
                break;
        }
    }, [status])
    return (
        <Chip variant="filled" sx={{ backgroundColor: bgColor, color: color, textTransform: 'capitalize' }} label={status} />
    )
}
export default AgentStatusChip;

