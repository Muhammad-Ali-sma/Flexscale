import { formReducer } from '../../utils/globalFunctions';
import DialogActions from '@mui/material/DialogActions';
import SelectDropdown from '../global/SelectDropdown';
import { useReducer, useRef, useState } from 'react';
import SnackAlert from '../global/SnackAlert';
import CustomBtn from '../global/CustomBtn';
import FlexField from '../global/FlexField';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

const UploadProfileImage = ({ handleClose, setValue, setImage, setSelectedImage }) => {

    const inputRef = useRef(null);
    const [msg, setMsg] = useState(false);
    const [type, setType] = useState(null);
    const [file, setFile] = useState(null);
    const [showSnack, setShowSnack] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});


    const handleOnSave = () => {
        if (formData['Method'] === 'URL' && formData['DOCURL']) {
            if (!formData['DOCURL']?.includes('https') || (!formData['DOCURL']?.endsWith('.png') && !formData['DOCURL']?.endsWith('.jpeg'))) {
                setType('error');
                setMsg("Invalid url!");
                setShowSnack(true);
                setIsSubmitted(false);
                return;
            }
            handleClose();
        } else {
            handleClose();
        }
    }

    const readURL = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                setSelectedImage(e.target.result)
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    return (
        <>
            <Box>
                <SelectDropdown
                    variant="standard"
                    setValue={(e) => { setFormData(e); setValue(e); setIsSubmitted(false); }}
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
                            setValue={(e) => { setFormData(e); setValue(e); setIsSubmitted(false); }}
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
                                    onChange={(e) => { setFile(e.target.files[0]); setImage(e.target.files[0]); setIsSubmitted(false); readURL(e.target) }}
                                    accept="image/png, image/jpeg"
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
                                setValue={(e) => { setFormData(e); setValue(e); setIsSubmitted(false); }}
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
                    onClick={() => handleOnSave()}
                    title={'Save'}
                    variant='contained'
                    disabled={formData['Method'] ? (formData['Method'] === 'URL' ? (formData['DOCURL'] && formData['DocumentName'] ? false : true) : (file ? false : true)) : true}
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

export default UploadProfileImage;