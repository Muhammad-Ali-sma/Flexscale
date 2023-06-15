import { Avatar, Grid, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { selectAuth } from "../../store/authSlice";
import { useSelector } from "react-redux";
import CustomBtn from "./CustomBtn";

export const BodyHeader = ({ title, subtitle = "", showAvatar = false, button, btnIcon, handleOnSendReminder, handleOnStatusChange, handleRemove, firstBtnTitle, containerStyle, removeBtnTitle, handleOnReject, handleOnHire }) => {
    const user = useSelector(selectAuth)?.userData;

    const stringAvatar = (name) => {
        if (name) {
            let splitName = name?.split(' ');
            return {
                sx: {
                    bgcolor: "#BDBDBD",
                },
                children: `${splitName[0] && splitName[0][0]}${splitName[1] && splitName[1][0]}`,
            };
        }
    }

    return (
        <Grid container>
            <Grid item sx={[{ mb: 4, display: "flex", width: '100%', gap: 3, alignItems: "center" }, containerStyle]}>
                <div>
                    <div style={{ display: 'flex', gap: 3, alignItems: "center" }}>
                        {showAvatar &&
                            <Avatar {...stringAvatar(title)} />
                        }
                        {(title && !title.includes('undefined')) && <Typography sx={{ fontWeight: 700, fontSize: { xs: "1.4rem", md: "2.1rem" } }}>{title}</Typography>}
                    </div>
                    {(subtitle && !subtitle.includes('undefined')) &&
                        <Typography variant="p" sx={{ opacity: 0.6 }}>{subtitle}</Typography>
                    }
                </div>
                <div>
                    {handleOnHire &&
                        <CustomBtn
                            onClick={handleOnHire}
                            variant='contained'
                            title={firstBtnTitle ? firstBtnTitle : 'Hire'}
                            btnStyle={{ marginRight: 1, }}
                            icon={btnIcon}
                        />}
                    {handleRemove &&
                        <CustomBtn
                            onClick={handleRemove}
                            variant='contained'
                            title={removeBtnTitle ? removeBtnTitle : 'Delete'}
                            btnStyle={{ marginRight: 1, backgroundColor: 'red', color: 'white' }}
                        />}
                    {handleOnReject &&
                        <CustomBtn
                            onClick={handleOnReject}
                            variant='outlined'
                            title={removeBtnTitle ? removeBtnTitle : 'Reject'}
                            btnStyle={{ marginRight: 1, border: '1px solid red', color: 'red' }}
                            icon={<CloseIcon />}
                        />}
                    {handleOnSendReminder &&
                        <CustomBtn
                            onClick={handleOnSendReminder}
                            variant='contained'
                            title={'Send Reminder'}
                            btnStyle={{ marginRight: 1, }}
                        />}
                    {handleOnStatusChange &&
                        <CustomBtn
                            onClick={handleOnStatusChange}
                            variant='contained'
                            title={'Change Status'}
                            btnStyle={{ marginRight: 1, }}
                        />}
                    {button}
                </div>
            </Grid>
        </Grid>
    )
}