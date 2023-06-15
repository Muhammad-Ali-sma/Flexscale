import { formReducer, getUsersList, s3 } from '../../utils/globalFunctions';
import DocumentService from '../../Services/DocumentService';
import DialogActions from '@mui/material/DialogActions';
import SelectDropdown from '../global/SelectDropdown';
import { useReducer, useRef, useState } from 'react';
import { selectAuth } from '../../store/authSlice';
import SnackAlert from '../global/SnackAlert';
import CustomBtn from '../global/CustomBtn';
import FlexField from '../global/FlexField';
import { Typography } from '@mui/material';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { Box } from '@mui/system';

const UploadDocumentModal = ({ handleClose, user }) => {

    const inputRef = useRef(null);
    const [msg, setMsg] = useState(false);
    const [type, setType] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const currentUser = useSelector(selectAuth)?.userData;
    const [formData, setFormData] = useReducer(formReducer, {});


    const handleOnSave = () => {
        setLoading(true);
        setIsSubmitted(true);
        if (formData['Method'] === 'URL' && formData['DOCURL'] && formData['DocumentName']) {
            if (!formData['DOCURL']?.includes('https')) {
                setType('error');
                setMsg("Invalid url!");
                setShowSnack(true);
                setLoading(false);
                return;
            }
            const temp = {
                Location: formData['DOCURL'],
                User: user?._id,
                prevDocIds: user?.Documents?.map(x => x?._id),
                FileName: formData['DocumentName'],
                CreatedBy: currentUser?._id
            }
            addDoc.mutate(temp);
            return;
        }
        if (formData['Method'] === 'Document' && formData['DocumentName']) {
            if (!file) {
                setType('error');
                setMsg("Please select your file!");
                setShowSnack(true);
                setLoading(false);
                return;
            }
            s3(user?._id).uploadFile(file, formData['DocumentName'] ?? file?.name)
                .then(data => {
                    if (data?.key) {
                        const temp = {
                            Location: data?.location,
                            User: user?._id,
                            prevDocIds: user?.Documents?.map(x => x?._id),
                            FileName: formData['DocumentName'] ?? file?.name,
                            CreatedBy: currentUser?._id
                        }
                        addDoc.mutate(temp);
                    }
                })
                .catch(err => {
                    setType('error');
                    setMsg(err);
                    setShowSnack(true);
                });
            return;
        }
        setLoading(false);
    }
    const addDoc = useMutation((data) => DocumentService.uploadDoc(data), {
        onSettled: (res) => {
            getUsersList();
            if (res?.success) {
                handleClose();
                setType('success');
                setMsg("Document Uploaded Successfully");
                setShowSnack(true);
            } else {
                setType('error');
                setMsg("Document Upload Failed!");
                setShowSnack(true);
            }
        }
    });

    return (
        <>
            <Box>
                <SelectDropdown
                    variant="standard"
                    setValue={setFormData}
                    label="Choose an upload method"
                    name="Method"
                    required={true}
                    showAll={false}
                    data={['URL', "Document"]}
                    isSubmitted={isSubmitted}
                />
            </Box>
            {formData['Method'] &&
                <>
                    <Box sx={{ mt: 1 }}>
                        <FlexField
                            placeholder="Document Name"
                            label="Document Name"
                            as="text"
                            variant="standard"
                            setValue={setFormData}
                            name='DocumentName'
                            required={true}
                            isSubmitted={isSubmitted}
                        />
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        {formData['Method'] === 'Document' ?
                            <>
                                <input
                                    style={{ display: 'none' }}
                                    ref={inputRef}
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <CustomBtn
                                    onClick={() => inputRef.current.click()}
                                    title='Upload File'
                                    variant='contained'
                                    btnStyle={{ mr: 1 }}
                                />
                                <Typography>{file?.name}</Typography>
                            </>
                            :
                            <FlexField
                                placeholder="Add a URL"
                                label="Add a URL"
                                as="text"
                                variant="standard"
                                setValue={setFormData}
                                required={true}
                                isSubmitted={isSubmitted}
                                name='DOCURL'
                            />
                        }
                    </Box>
                </>
            }
            <DialogActions sx={{ mt: 2 }}>
                <CustomBtn
                    onClick={() => { handleClose(); setIsSubmitted(false) }}
                    title='Close'
                    variant='outlined'
                    btnStyle={{ mr: 1 }}
                />
                <CustomBtn
                    onClick={handleOnSave}
                    title={'Save'}
                    variant='contained'
                    loading={loading}
                />
            </DialogActions>
            <SnackAlert
                show={showSnack}
                type={type}
                handleClose={() => setShowSnack(false)}
                msg={msg}
            />
        </>
    )
}

export default UploadDocumentModal;