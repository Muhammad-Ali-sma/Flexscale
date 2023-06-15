import moment from 'moment';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Calendar from '../global/Calendar';
import FlexField from '../global/FlexField';
import { Typography, } from '@mui/material';
import CustomBtn from '../global/CustomBtn';
import SnackAlert from '../global/SnackAlert';
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useQuery } from 'react-query';
import SelectDropdown from '../global/SelectDropdown';
import { CLIENT_BILLING_ADMIN, CLIENT_SUPER_ADMIN, invoiceTypes } from '../../utils';
import { useEffect, useReducer, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import InvoiceService from '../../Services/InvoiceService';
import TimesheetService from '../../Services/TimesheetService';
import { formatNum, formReducer } from '../../utils/globalFunctions';

const CreateInvoiceModal = ({ handleClose }) => {

    const router = useRouter();
    const [step, setStep] = useState(1);
    const [msg, setMsg] = useState(false);
    const [type, setType] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lineItems, setLineItems] = useState([]);
    const [showSnack, setShowSnack] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const usersList = useSelector(state => state.dataSlice.usersList);
    const organizations = useSelector(state => state.dataSlice.OrganizationList);
    const { data: list } = useQuery(['getAllTimesheets'], () => TimesheetService.getAllTimesheets());

    const handleOnSubmit = () => {
        setIsSubmitted(true);
        if (step === 1 && formData['Organization'] && formData['InvoiceType'] && formData['BilledTo']) {
            setIsSubmitted(false);
            setStep(step + 1);
        }
        if (formData['InvoiceType'] === 'Onboarding') {
            if (step === 2 && formData['UnitPrice'] && formData['Quantity'] && formData['DueDate']) {
                setIsSubmitted(false);
                setStep(step + 1);
            }
            if (step === 3) {
                setLoading(true);
                let temp = {
                    InvoiceItems: [{
                        name: 'Onboarding Fees',
                        quantity: formData['Quantity'],
                        unitPrice: formData['UnitPrice']
                    }],
                    Amount: formData['Quantity'] * formData['UnitPrice'],
                    DueDate: formData['DueDate'],
                    Organization: formData['Organization'],
                    Description: formData['Description'],
                    BilledTo: formData['BilledTo'],
                    InvoiceType: formData['InvoiceType'],
                }
                createInvoice.mutate(temp);
            }
        }
        if (formData['InvoiceType'] === 'Hourly') {
            if (step === 2 && formData['Timesheets'] && formData['DueDate']) {
                setIsSubmitted(false);
                setStep(step + 1);
            }
            if (step === 3) {
                setLoading(true);
                let tempSheets = [];
                formData['Timesheets']?.map(x => (
                    tempSheets.push({
                        name: `${x?.User?.FirstName} ${x?.User?.LastName} - ${x?.Contract?.JobTitle} - ${moment(x?.TimePeriodStart)?.format('MMM DD')}-${moment(x?.TimePeriodEnd)?.format('DD, YYYY')}`,
                        quantity: x?.TimeLog.reduce((acc, item) => acc + Number(item?.hours), 0),
                        unitPrice: x?.Contract?.RatePerHour
                    })
                ))
                let temp = {
                    InvoiceItems: tempSheets,
                    Amount: formData['Amount'],
                    DueDate: formData['DueDate'],
                    Organization: formData['Organization'],
                    Description: formData['Description'],
                    BilledTo: formData['BilledTo'],
                    Timesheets: formData['Timesheets'],
                    InvoiceType: formData['InvoiceType'],
                    InvoiceNumber: '123-213-12'
                }
                createInvoice.mutate(temp);
            }
        }
        if (formData['InvoiceType'] === 'Custom') {
            if (step === 2 && lineItems?.length > 0 && formData['DueDate']) {
                setIsSubmitted(false);
                setStep(step + 1);
            }
            if (step === 3) {
                setLoading(true);
                let temp = {
                    InvoiceItems: lineItems,
                    Amount: lineItems?.reduce((acc, val) => acc + (val.unitPrice * val.quantity), 0),
                    DueDate: formData['DueDate'],
                    Organization: formData['Organization'],
                    Description: formData['Description'],
                    BilledTo: formData['BilledTo'],
                    InvoiceType: formData['InvoiceType'],
                    InvoiceNumber: '123-213-12'
                }
                createInvoice.mutate(temp);
            }
        }
    }
    const createInvoice = useMutation((data) => InvoiceService.Create(data), {
        onSettled: (res) => {
            if (res?.success) {
                router.push(`/invoice/${res?.data?.invoiceId}`);
                setIsSubmitted(false);
            } else {
                setLoading(false);
                setType('error');
                setMsg(res?.message);
                setShowSnack(true);
            }
        }
    });

    useEffect(() => {
        let totalAmount = 0;
        formData['Timesheets']?.map(item => {
            if (item?.Contract?.RatePerHour) {
                totalAmount += (item?.Contract?.RatePerHour * item?.TimeLog.reduce((acc, item) => acc + Number(item?.hours), 0));
                let total = {
                    target: {
                        value: totalAmount,
                        name: 'Amount'
                    },
                }
                setFormData(total)
            }
        })
    }, [formData['Timesheets']])

    useEffect(() => {
        setUsers(usersList?.filter(x => {
            let OrgIds = [];
            x?.Organization?.map(y => OrgIds.push(y._id));
            if (OrgIds.includes(formData['Organization']?._id) && (x?.AccessLevel === CLIENT_BILLING_ADMIN.level || x?.AccessLevel === CLIENT_SUPER_ADMIN.level)) {
                return x;
            }
        }));
    }, [usersList, formData['Organization']])

    return (
        <>
            {step == 1 &&
                <Box>
                    <SelectDropdown
                        variant="standard"
                        setValue={(e) => { setFormData(e); }}
                        label="Select Organization"
                        name="Organization"
                        required={true}
                        showAll={false}
                        data={organizations}
                        isSubmitted={isSubmitted}
                    />
                    <SelectDropdown
                        variant="standard"
                        setValue={(e) => { setFormData(e); }}
                        label="Select Invoice Type"
                        name="InvoiceType"
                        required={true}
                        showAll={false}
                        data={invoiceTypes}
                        isSubmitted={isSubmitted}
                    />
                    {formData['Organization'] &&
                        <SelectDropdown
                            variant="standard"
                            setValue={(e) => { setFormData(e); }}
                            label="Select Client Billing Admin"
                            name="BilledTo"
                            required={true}
                            showAll={false}
                            data={users}
                            getItem={true}
                            isSubmitted={isSubmitted}
                        />
                    }
                </Box>
            }
            {formData['InvoiceType'] === 'Onboarding' &&
                <>
                    {step == 2 &&
                        <>
                            <Typography>For Onboarding Fees: </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '40%' }}>
                                    <FlexField
                                        placeholder="Quantity"
                                        as="number"
                                        variant="standard"
                                        setValue={setFormData}
                                        required={true}
                                        isSubmitted={isSubmitted}
                                        name='Quantity'
                                    />
                                </div>
                                <div style={{ width: '40%', marginLeft: 30 }}>
                                    <FlexField
                                        placeholder="Unit Price"
                                        as="number"
                                        variant="standard"
                                        setValue={setFormData}
                                        required={true}
                                        isSubmitted={isSubmitted}
                                        name='UnitPrice'
                                    />
                                </div>
                            </Box>
                            {(formData['UnitPrice'] && formData['Quantity']) && <Typography><b>Total Amount</b>&nbsp;  {'$' + formatNum(formData['UnitPrice'] * formData['Quantity'])}</Typography>}

                            <Box>
                                <Calendar
                                    label={"Due Date"}
                                    setValue={setFormData}
                                    name="DueDate"
                                    minDate={moment().format('MM-DD-YYYY')}
                                    required={true}
                                    isSubmitted={isSubmitted}
                                />
                            </Box>
                            <Box sx={{ mt: 2, mb: 3 }}>
                                <FlexField
                                    variant="standard"
                                    setValue={setFormData}
                                    placeholder="Add a description"
                                    name="Description"
                                    as="text"
                                />
                            </Box>
                        </>
                    }
                </>
            }
            {formData['InvoiceType'] === 'Hourly' &&
                <>
                    {step == 2 &&
                        <>
                            <Typography>For Hourly Fees: </Typography>
                            <Box>
                                <Calendar
                                    label={"Due Date"}
                                    setValue={setFormData}
                                    name="DueDate"
                                    minDate={moment().format('MM-DD-YYYY')}
                                    required={true}
                                    isSubmitted={isSubmitted}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <FlexField
                                    variant="standard"
                                    setValue={setFormData}
                                    placeholder="Add a description"
                                    name="Description"
                                    as="text"
                                />
                            </Box>
                            <Box sx={{ mt: 1, mb: 3 }}>
                                <SelectDropdown
                                    variant="standard"
                                    setValue={setFormData}
                                    label="Search timesheets"
                                    name="Timesheets"
                                    data={list.timesheets?.filter(x => x?.Organization?._id === formData['Organization']?._id)}
                                    required={true}
                                    isSubmitted={isSubmitted}
                                    multiple={true}
                                />
                            </Box>
                            {formData['Timesheets']?.map(item => {
                                let totalHours = 0;
                                if (item?.Contract?.RatePerHour) {
                                    totalHours = item?.TimeLog.reduce((acc, item) => acc + Number(item?.hours), 0);
                                }
                                return (
                                    <Box sx={{ mt: 1, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <Box sx={{ width: '20%' }}>
                                            <Typography>{item?.User?.FirstName} {item?.User?.LastName}</Typography>
                                        </Box>
                                        <Box sx={{ width: '20%' }}>
                                            <FlexField
                                                variant="standard"
                                                setValue={setFormData}
                                                label="Rate (per hour)"
                                                as="text"
                                                defaultVal={'$' + item?.Contract?.RatePerHour ? item?.Contract?.RatePerHour : 0}
                                                disabled={true}
                                            />
                                        </Box>
                                        <Box sx={{ width: '20%' }}>
                                            <FlexField
                                                variant="standard"
                                                setValue={setFormData}
                                                label="Hours"
                                                disabled={true}
                                                as="text"
                                                defaultVal={totalHours}
                                            />
                                        </Box>
                                        <Box sx={{ width: '20%' }}>
                                            <FlexField
                                                disabled={true}
                                                variant="standard"
                                                setValue={setFormData}
                                                label="Amount"
                                                as="text"
                                                defaultVal={'$' + item?.Contract?.RatePerHour ? (item?.Contract?.RatePerHour * totalHours) : 0}
                                            />
                                        </Box>
                                    </Box>
                                )
                            })}
                            {formData['Timesheets']?.length > 0 && <Typography><b>Total Amount</b> &nbsp;${formatNum(formData['Amount'])}</Typography>}
                        </>
                    }
                </>
            }
            {formData['InvoiceType'] === 'Custom' &&
                <>
                    {step == 2 &&
                        <>
                            <Typography>For Custom: </Typography>
                            <Box>
                                <Calendar
                                    label={"Due Date"}
                                    setValue={setFormData}
                                    name="DueDate"
                                    minDate={moment().format('MM-DD-YYYY')}
                                    required={true}
                                    isSubmitted={isSubmitted}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <FlexField
                                    variant="standard"
                                    setValue={setFormData}
                                    placeholder="Add a description"
                                    name="Description"
                                    as="text"
                                />
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography><b>Total Amount</b> &nbsp;${formatNum(lineItems?.reduce((acc, val) => acc + (val.unitPrice * val.quantity), 0))}</Typography>
                                <CustomBtn
                                    title="Add line item"
                                    variant={'contained'}
                                    onClick={() => setLineItems([...lineItems, { name: '', quantity: '', unitPrice: '' }])}
                                />
                            </Box>
                            {lineItems?.map((x, i) => (
                                <Box sx={{ mt: 1, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Box sx={{ width: '20%' }}>
                                        <FlexField
                                            variant="standard"
                                            setValue={(e) => {
                                                let temp = lineItems;
                                                temp[i].name = e.target.value;
                                                setLineItems(JSON.parse(JSON.stringify(temp)));
                                            }}
                                            placeholder="Description"
                                            as="text"
                                            defaultVal={x?.name}
                                        />
                                    </Box>
                                    <Box sx={{ width: '20%' }}>
                                        <FlexField
                                            variant="standard"
                                            setValue={(e) => {
                                                let temp = lineItems;
                                                temp[i].quantity = e.target.value;
                                                setLineItems(JSON.parse(JSON.stringify(temp)));
                                            }}
                                            placeholder="Quantity"
                                            defaultVal={x?.quantity}
                                            as="number"
                                        />
                                    </Box>
                                    <Box sx={{ width: '20%' }}>
                                        <FlexField
                                            variant="standard"
                                            setValue={(e) => {
                                                let temp = lineItems;
                                                temp[i].unitPrice = e.target.value;
                                                setLineItems(JSON.parse(JSON.stringify(temp)));
                                            }}
                                            placeholder="Unit Price"
                                            defaultVal={x?.unitPrice}
                                            as="number"
                                        />
                                    </Box>
                                    <Box sx={{ width: '20%' }}>
                                        <FlexField
                                            variant="standard"
                                            setValue={setFormData}
                                            placeholder="Amount"
                                            name="Amount"
                                            as="text"
                                            defaultVal={'$' + formatNum((x.unitPrice && x.quantity) ? x.unitPrice * x.quantity : 0)}
                                            disabled={true}
                                        />
                                    </Box>
                                    <ClearIcon onClick={(e) => setLineItems(lineItems?.filter(y => y !== x))} />
                                </Box>
                            )
                            )}
                        </>
                    }
                </>
            }
            {step == 3 &&
                <Box>
                    <Typography>Confirm the following invoice details before submitting: </Typography>
                    <Box component={'ul'}>
                        <Typography component='li'><b>Total Amount: </b>${formData['InvoiceType'] === 'Onboarding' ? formatNum(formData['UnitPrice'] * formData['Quantity']) : formData['InvoiceType'] === 'Custom' ? formatNum(lineItems?.reduce((acc, val) => acc + (val.unitPrice * val.quantity), 0)) : formatNum(formData['Amount'])}</Typography>
                        <Typography component='li'><b>Due Date: </b>{moment(formData['DueDate']).format('MM-DD-YYYY')}</Typography>
                        {formData['Description'] && <Typography component='li'><b>Description: </b>{formData['Description']}</Typography>}
                    </Box>
                    <Typography>Clicking Submit will create an invoice and notify the client. </Typography>
                </Box>
            }
            <DialogActions sx={{ mt: 2 }}>
                <CustomBtn
                    onClick={() => { handleClose(); setIsSubmitted(false) }}
                    title='Close'
                    variant='outlined'
                    btnStyle={{ mr: 1 }}
                />
                <CustomBtn
                    onClick={handleOnSubmit}
                    title={step === 3 ? 'Submit' : 'Next'}
                    variant='contained'
                    disabled={formData['InvoiceType'] === 'Custom' && step === 2 && !lineItems[0]?.name ? true : false}
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

export default CreateInvoiceModal;