import AgentStatusChip from "../components/global/AgentStatusChip";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { formatNum } from "./globalFunctions";
import Link from "../components/global/Link";
import { Typography } from "@mui/material";
import { store } from "../store/store";
import moment from "moment";
import { accessLevel } from ".";



export const OrganizationColumns = [
    {
        field: 'Name',
        flex: 1,
        headerName: 'Name'
    },
    {
        field: 'OrganizationType',
        flex: 0.6,
        headerName: 'Type'
    },
    {
        field: '_id',
        flex: 0.7,
        headerName: 'ID'
    },
    {
        field: 'createdAt',
        flex: 0.6,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Action',
        flex: 0.6,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const AdminContractColumns = [
    {
        field: 'JobTitle',
        flex: 1,
        headerName: 'Job Title'
    },
    {
        field: 'Organization',
        flex: 0.6,
        headerName: 'Organization',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.Organization?.Name}</Typography>
            );
        }
    },
    {
        field: 'User',
        flex: 0.7,
        headerName: 'Team Member',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.User?.FirstName} {params?.row?.User?.LastName}</Typography>
            );
        }
    },
    {
        field: 'Status',
        flex: 0.7,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row.Status} />
            );
        }
    },
    {
        field: 'createdAt',
        flex: 0.6,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Action',
        flex: 0.6,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const PlacementColumns = [
    {
        field: 'JobTitle',
        flex: 0.6,
        headerName: 'Job Title'
    },
    {
        field: 'Organization',
        flex: 0.6,
        headerName: 'Organization',
        renderCell: (params) => {
            return (
                <Typography >{params?.row?.Organization?.Name}</Typography>
            );
        }
    },
    {
        field: 'Status',
        flex: 0.6,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row.Status} />
            );
        }
    },
    {
        field: 'StartDate',
        flex: 0.4,
        headerName: 'Start Date',
        renderCell: (params) => {
            return (
                <Typography >{moment(params?.row?.StartDate).format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'createdAt',
        flex: 0.4,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography >{moment(params?.row?.createdAt).format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Action',
        flex: 0.4,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const InvoiceColumns = [
    {
        field: 'Amount',
        flex: 1,
        headerName: 'Amount',
        renderCell: (params) => {
            return (
                <Typography>${formatNum(params?.row?.total / 100)}</Typography>
            );
        }
    },
    {
        field: 'Status',
        flex: 0.5,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params?.row?.status} />
            );
        }
    },
    {
        field: 'InvoiceNumber',
        flex: 0.7,
        headerName: 'Invoice Number',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.number}</Typography>
            );
        }
    },
    {
        field: 'Organization',
        flex: 1,
        headerName: 'Organization',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?._doc?.Organization?.Name}</Typography>
            );
        }
    },
    {
        field: 'DueDate',
        flex: 0.7,
        headerName: 'Due Date',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.due_date ? moment.unix(params?.row?.due_date)?.format('MM-DD-YYYY') : ''}</Typography>
            );
        }
    },
    {
        field: 'createdAt',
        flex: 0.6,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Action',
        flex: 0.6,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const TimesheetColumns = [
    {
        field: 'Organization',
        flex: 0.6,
        headerName: 'Organization',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.Organization?.Name}</Typography>
            );
        }
    },
    {
        field: 'User',
        flex: 0.7,
        headerName: 'Team Member',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.User?.FirstName} {params?.row?.User?.LastName}</Typography>
            );
        }
    },
    {
        field: 'TimePeriod',
        flex: 0.7,
        headerName: 'Time Period',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.TimePeriodStart)?.format('MMM DD ')} - {moment(params?.row?.TimePeriodEnd)?.format('DD, YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Id',
        flex: 0.7,
        headerName: 'Timesheet ID',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?._id}</Typography>
            );
        }
    },
    {
        field: 'createdAt',
        flex: 0.6,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Action',
        flex: 0.6,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const ClientTimesheetColumns = [
    {
        field: 'TimePeriod',
        flex: 0.7,
        headerName: 'Time Period',
        renderCell: (params) => {
            return (
                <Typography>For {moment(params?.row?.TimePeriodStart)?.format('MMM DD ')} - {moment(params?.row?.TimePeriodEnd)?.format('DD, YYYY')}</Typography>
            );
        }
    },
    {
        field: 'createdAt',
        flex: 0.6,
        headerName: 'Submitted Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },

    {
        field: 'Submitted By',
        flex: 0.7,
        headerName: 'Submitted By',
        renderCell: (params) => {
            return (
                <Typography>{store.getState().dataSlice.usersList?.filter(x => x._id === params?.row?.CreatedBy)[0]?.FirstName} {store.getState().dataSlice.usersList?.filter(x => x._id === params?.row?.CreatedBy)[0]?.LastName}</Typography>
            );
        }
    },

    {
        field: 'Action',
        flex: 0.6,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const BillingColumns = [
    {
        field: 'id',
        flex: 1,
        headerName: 'Invoice ID',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.number}</Typography>
            );
        }
    },
    {
        field: 'DueDate',
        flex: 0.7,
        headerName: 'Due Date',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.due_date && moment.unix(params?.row?.due_date)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Amount',
        flex: 0.6,
        headerName: 'Amount',
        renderCell: (params) => {
            return (
                <Typography>${formatNum(params?.row?.total / 100)}</Typography>
            );
        }
    },
    {
        field: 'status',
        flex: 0.7,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row.status} />
            );
        }
    },
];
export const PaymentColumns = [
    {
        field: 'Amount',
        flex: 0.6,
        headerName: 'Amount',
        renderCell: (params) => {
            return (
                <Typography>${formatNum(params?.row?.payment?.amount / 100)}</Typography>
            );
        }
    },
    {
        field: 'Status',
        flex: 0.7,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row.payment?.status} />
            );
        }
    },
    {
        field: '_id',
        flex: 1,
        headerName: 'Payment ID',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.payment?.id}</Typography>
            );
        }
    },
    {
        field: 'Organization',
        flex: 0.7,
        headerName: 'Organization',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.payment?.metadata?.orgName}</Typography>
            );
        }
    },
    {
        field: 'createdAt',
        flex: 0.6,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment.unix(params?.row?.payment?.created)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Action',
        flex: 0.6,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const DocumentColumns = [
    {
        field: 'FileName',
        flex: 1,
        headerName: 'Document Name',
    },
    {
        field: 'createdAt',
        flex: 1,
        headerName: 'Upload Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params.row.createdAt).format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'CreatedBy',
        flex: 1,
        headerName: 'Uploaded By',
    },
    {
        field: 'Action',
        flex: 1,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={"#blank"} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    }
];
export const RequestColumns = [
    {
        field: 'JobTitle',
        flex: 1,
        headerName: 'Job Title',
    },
    {
        field: 'StartDate',
        flex: 1,
        headerName: 'Start Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.StartDate)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Status',
        flex: 1,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row?.Status} />
            );
        }
    },
    {
        field: 'createdAt',
        flex: 1,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt).format('MM-DD-YYYY')}</Typography>
            );
        }
    },
];
export const ContractColumns = [
    {
        field: 'JobTitle',
        flex: 1,
        headerName: 'Job Title',
    },
    {
        field: 'member',
        flex: 1,
        headerName: 'Team Member',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.User?.FirstName} {params?.row?.User?.LastName}</Typography>
            );
        }
    },
    {
        field: 'Status',
        flex: 1,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row?.Status} />
            );
        }
    },
    {
        field: 'createdAt',
        flex: 1,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt).format('MM-DD-YYYY')}</Typography>
            );
        }
    },
];
export const AdminUserColumns = [
    {
        field: 'Email',
        flex: 0.6,
        headerName: 'Email'
    },
    {
        field: 'FirstName',
        flex: 0.6,
        headerName: 'First Name'
    },
    {
        field: 'LastName',
        flex: 0.6,
        headerName: 'Last Name'
    },
    {
        field: 'AccessLevel',
        flex: 0.4,
        headerName: 'Level',
        renderCell: (params) => {
            return (
                <Typography>{accessLevel.filter(x => x.level === params?.row?.AccessLevel)[0].label || ""}</Typography>
            );
        }
    },
    {
        field: 'createdAt',
        flex: 0.4,
        headerName: 'Created Date',
        renderCell: (params) => {
            return (
                <Typography>{moment(params?.row?.createdAt)?.format('MM-DD-YYYY')}</Typography>
            );
        }
    },
    {
        field: 'Action',
        flex: 0.4,
        headerName: 'Action',
        renderCell: (params) => {
            return (
                <Link href={``} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link>
            );
        }
    },
];
export const ClientPaymentColumns = [
    {
        field: 'payment_intent',
        flex: 1,
        headerName: 'Payment ID',
        renderCell: (params) => {
            return (
                <Typography>{params?.row?.payment?.id}</Typography>
            );
        }
    },
    {
        field: 'payment_method_details',
        flex: 1,
        headerName: 'Payment Method',
        renderCell: (params) => {
            if (params?.row?.payment?.charges?.data[0]?.payment_method_details?.type === "ach_debit") {
                return (
                    <Typography sx={{ textTransform: 'capitalize' }}>****{params?.row?.payment?.charges?.data[0]?.payment_method_details?.ach_debit?.last4} {params?.row?.payment?.charges?.data[0]?.payment_method_details?.ach_debit?.bank_name} Card</Typography>
                );
            } else {
                return (
                    <Typography sx={{ textTransform: 'capitalize' }}>****{params?.row?.payment?.charges?.data[0]?.payment_method_details?.card?.last4} {params?.row?.payment?.charges?.data[0]?.payment_method_details?.card?.brand} Card</Typography>
                );
            }
        }
    },
    {
        field: 'Amount',
        flex: 0.6,
        headerName: 'Amount',
        renderCell: (params) => {
            return (
                <Typography>${formatNum(params?.row?.payment?.amount / 100)}</Typography>
            );
        }
    },
    {
        field: 'status',
        flex: 0.7,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row.payment?.status} />
            );
        }
    },
];
export const ClientUserColumns = [
    {
        field: 'FirstName',
        flex: 1,
        headerName: 'Name',
        renderCell: (params) => {
            return (
                <Typography>{params.row?.User?.FirstName} {params.row?.User?.LastName}</Typography>
            );
        }
    },
    {
        field: 'JobTitle',
        flex: 1,
        headerName: 'Role',
        renderCell: (params) => {
            return (
                <Typography>{params.row?.JobTitle}</Typography>
            );
        }
    },
    {
        field: 'Status',
        flex: 0.6,
        headerName: 'Status',
        renderCell: (params) => {
            return (
                <AgentStatusChip status={params.row?.Status} />
            );
        }
    },
    {
        field: 'Manager',
        flex: 1,
        headerName: 'Manager',
        renderCell: (params) => {
            return (
                <Typography>{params.row?.User?.Manager[0]?.FirstName} {params.row?.User?.Manager[0]?.LastName}</Typography>
            );
        }
    }
];
export const ErrorLogColumns = [
    {
        field: 'code',
        flex: 0.3,
        headerName: 'Status Code'
    },
    {
        field: 'message',
        flex: 2,
        headerName: 'Response'
    },
    {
        field: 'userId',
        flex: 0.5,
        headerName: 'User Id'
    }
];

export const countryList = [
    'United States',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua & Deps',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Central African Rep',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Congo {Democratic Rep}',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland {Republic}',
    'Israel',
    'Italy',
    'Ivory Coast',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea North',
    'Korea South',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar, {Burma}',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russian Federation',
    'Rwanda',
    'St Kitts & Nevis',
    'St Lucia',
    'Saint Vincent & the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome & Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Togo',
    'Tonga',
    'Trinidad & Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
];
export const pronouns = [
    'He/Him', 'She/Her', 'They/Their', 'Other', 'none'
];
export const WorkExperience = [
    '0+ years of experience', '1+ years of experience', '2+ years of experience', '3+ years of experience', '4+ years of experience', '5+ years of experience', '6+ years of experience', '7+ years of experience', '8+ years of experience', '9+ years of experience', '10+ years of experience'
];
export const timeZones = [
    '(UTC-05:00) Eastern Time (US and Canada)	America/New_York',
    '(UTC-08:00) Pacific Time (US and Canada)	America/Los_Angeles',
    '(UTC-12:00) International Date Line West	Etc/GMT+12',
    '(UTC-11:00) Coordinated Universal Time-11	Etc/GMT+11',
    '(UTC-10:00) Hawaii	Pacific/Honolulu',
    '(UTC-09:00) Alaska	America/Anchorage',
    '(UTC-08:00) Baja California	America/Santa_Isabel',
    '(UTC-07:00) Chihuahua, La Paz, Mazatlan	America/Chihuahua',
    '(UTC-07:00) Arizona	America/Phoenix',
    '(UTC-07:00) Mountain Time (US and Canada)	America/Denver',
    '(UTC-06:00) Central America	America/Guatemala',
    '(UTC-06:00) Central Time (US and Canada)	America/Chicago',
    '(UTC-06:00) Saskatchewan	America/Regina',
    '(UTC-06:00) Guadalajara, Mexico City, Monterey	America/Mexico_City',
    '(UTC-05:00) Bogota, Lima, Quito	America/Bogota',
    '(UTC-05:00) Indiana (East)	America/Indiana/Indianapolis',
    '(UTC-04:30) Caracas	America/Caracas',
    '(UTC-04:00) Atlantic Time (Canada)	America/Halifax',
    '(UTC-04:00) Asuncion	America/Asuncion',
    '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan	America/La_Paz',
    '(UTC-04:00) Cuiaba	America/Cuiaba',
    '(UTC-04:00) Santiago	America/Santiago',
    '(UTC-03:30) Newfoundland	America/St_Johns',
    '(UTC-03:00) Brasilia	America/Sao_Paulo',
    '(UTC-03:00) Greenland	America/Godthab',
    '(UTC-03:00) Cayenne, Fortaleza	America/Cayenne',
    '(UTC-03:00) Buenos Aires	America/Argentina/Buenos_Aires',
    '(UTC-03:00) Montevideo	America/Montevideo',
    '(UTC-02:00) Coordinated Universal Time-2	Etc/GMT+2',
    '(UTC-01:00) Cape Verde	Atlantic/Cape_Verde',
    '(UTC-01:00) Azores	Atlantic/Azores',
    '(UTC+00:00) Casablanca	Africa/Casablanca',
    '(UTC+00:00) Monrovia, Reykjavik	Atlantic/Reykjavik',
    '(UTC+00:00) Dublin, Edinburgh, Lisbon, London	Europe/London',
    '(UTC+00:00) Coordinated Universal Time	Etc/GMT',
    '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna	Europe/Berlin',
    '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris	Europe/Paris',
    '(UTC+01:00) West Central Africa	Africa/Lagos',
    '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague	Europe/Budapest',
    '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb	Europe/Warsaw',
    '(UTC+01:00) Windhoek	Africa/Windhoek',
    '(UTC+02:00) Athens, Bucharest, Istanbul	Europe/Istanbul',
    '(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius	Europe/Kiev',
    '(UTC+02:00) Cairo	Africa/Cairo',
    '(UTC+02:00) Damascus	Asia/Damascus',
    '(UTC+02:00) Amman	Asia/Amman',
    '(UTC+02:00) Harare, Pretoria	Africa/Johannesburg',
    '(UTC+02:00) Jerusalem	Asia/Jerusalem',
    '(UTC+02:00) Beirut	Asia/Beirut',
    '(UTC+03:00) Baghdad	Asia/Baghdad',
    '(UTC+03:00) Minsk	Europe/Minsk',
    '(UTC+03:00) Kuwait, Riyadh	Asia/Riyadh',
    '(UTC+03:00) Nairobi	Africa/Nairobi',
    '(UTC+03:30) Tehran	Asia/Tehran',
    '(UTC+04:00) Moscow, St. Petersburg, Volgograd	Europe/Moscow',
    '(UTC+04:00) Tbilisi	Asia/Tbilisi',
    '(UTC+04:00) Yerevan	Asia/Yerevan',
    '(UTC+04:00) Abu Dhabi, Muscat	Asia/Dubai',
    '(UTC+04:00) Baku	Asia/Baku',
    '(UTC+04:00) Port Louis	Indian/Mauritius',
    '(UTC+04:30) Kabul	Asia/Kabul',
    '(UTC+05:00) Tashkent	Asia/Tashkent',
    '(UTC+05:00) Islamabad, Karachi	Asia/Karachi',
    '(UTC+05:30) Sri Jayewardenepura Kotte	Asia/Colombo',
    '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi	Asia/Kolkata',
    '(UTC+05:45) Kathmandu	Asia/Kathmandu',
    '(UTC+06:00) Astana	Asia/Almaty',
    '(UTC+06:00) Dhaka	Asia/Dhaka',
    '(UTC+06:00) Yekaterinburg	Asia/Yekaterinburg',
    '(UTC+06:30) Yangon	Asia/Yangon',
    '(UTC+07:00) Bangkok, Hanoi, Jakarta	Asia/Bangkok',
    '(UTC+07:00) Novosibirsk	Asia/Novosibirsk',
    '(UTC+08:00) Krasnoyarsk	Asia/Krasnoyarsk',
    '(UTC+08:00) Ulaanbaatar	Asia/Ulaanbaatar',
    '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi	Asia/Shanghai',
    '(UTC+08:00) Perth	Australia/Perth',
    '(UTC+08:00) Kuala Lumpur, Singapore	Asia/Singapore',
    '(UTC+08:00) Taipei	Asia/Taipei',
    '(UTC+09:00) Irkutsk	Asia/Irkutsk',
    '(UTC+09:00) Seoul	Asia/Seoul',
    '(UTC+09:00) Osaka, Sapporo, Tokyo	Asia/Tokyo',
    '(UTC+09:30) Darwin	Australia/Darwin',
    '(UTC+09:30) Adelaide	Australia/Adelaide',
    '(UTC+10:00) Hobart	Australia/Hobart',
    '(UTC+10:00) Yakutsk	Asia/Yakutsk',
    '(UTC+10:00) Brisbane	Australia/Brisbane',
    '(UTC+10:00) Guam, Port Moresby	Pacific/Port_Moresby',
    '(UTC+10:00) Canberra, Melbourne, Sydney	Australia/Sydney',
    '(UTC+11:00) Vladivostok	Asia/Vladivostok',
    '(UTC+11:00) Solomon Islands, New Caledonia	Pacific/Guadalcanal',
    '(UTC+12:00) Coordinated Universal Time+12	Etc/GMT-12',
    '(UTC+12:00) Fiji, Marshall Islands	Pacific/Fiji',
    '(UTC+12:00) Magadan	Asia/Magadan',
    '(UTC+12:00) Auckland, Wellington	Pacific/Auckland',
    "(UTC+13:00) Nuku'alofa	Pacific/Tongatapu",
    '(UTC+13:00) Samoa	Pacific/Apia'
]
export const Roles = [
    {
        title: "Operations",
        Bold: true
    },
    {
        title: "Customer Service",
        Bold: false
    },
    {
        title: "Call Support",
        Bold: false
    },
    {
        title: "Customer Service Agent",
        Bold: false
    },
    {
        title: "Customer Service Associate",
        Bold: false
    },
    {
        title: "Customer Service Operator",
        Bold: false
    },
    {
        title: "Customer Service Representative",
        Bold: false
    },
    {
        title: "Customer Success Manager",
        Bold: false
    },
    {
        title: "Customer Support Representative",
        Bold: false
    },
    {
        title: "Customer Support Specialist",
        Bold: false
    },
    {
        title: "Call Center Agent",
        Bold: false
    },
    {
        title: "Call Center Operator",
        Bold: false
    },
    {
        title: "Call Center Representative",
        Bold: false
    },
    {
        title: "Collections Agent",
        Bold: false
    },
    {
        title: "Benefits Analyst",
        Bold: false
    },
    {
        title: "Email and Chat Support",
        Bold: false
    },
    {
        title: "Customer Care Representative",
        Bold: false
    },
    {
        title: "Communications Support Agent",
        Bold: false
    },
    {
        title: "Content Moderator",
        Bold: false
    },
    {
        title: "Business Analyst",
        Bold: false
    },
    {
        title: "Data Analyst",
        Bold: false
    },
    {
        title: "Compliance Analyst",
        Bold: false
    },
    {
        title: "Compliance Specialist",
        Bold: false
    },
    {
        title: "Operations Analyst",
        Bold: false
    },
    {
        title: "Operations Specialist",
        Bold: false
    },
    {
        title: "Operations Manager",
        Bold: false
    },
    {
        title: "Operations Associate",
        Bold: false
    },
    {
        title: "Operations Coordinator",
        Bold: false
    },
    {
        title: "Document Processor",
        Bold: false
    },
    {
        title: "Document Specialist",
        Bold: false
    },
    {
        title: "Enrollment Specialist",
        Bold: false
    },
    {
        title: "Order Clerk",
        Bold: false
    },
    {
        title: "Order Filler",
        Bold: false
    },
    {
        title: "Order Processor",
        Bold: false
    },
    {
        title: "Receptionist",
        Bold: false
    },
    {
        title: "Scheduler",
        Bold: false
    },
    {
        title: "Scheduling Coordinator",
        Bold: false
    },
    {
        title: "Support Coordinator",
        Bold: false
    },
    {
        title: "Finance/Accounting",
        Bold: false
    },
    {
        title: "H.R.",
        Bold: false
    },
    {
        title: "Data Entry Specialist",
        Bold: false
    },
    {
        title: "Data Entry Analyst",
        Bold: false
    },
    {
        title: "Data Entry",
        Bold: false
    },
    {
        title: "Scheduling and Order Taking",
        Bold: false
    },
    {
        title: "IT Support",
        Bold: false
    },
    {
        title: "Virtual Assistant",
        Bold: false
    },
    {
        title: "Personal Assistant",
        Bold: false
    },
    {
        title: "Administrative Assistant",
        Bold: false
    },
    {
        title: "Administrative Clerk",
        Bold: false
    },
    {
        title: "Administrative Coordinator",
        Bold: false
    },
    {
        title: "Administrative Specialist",
        Bold: false
    },
    {
        title: "Help Desk Analyst",
        Bold: false
    },
    {
        title: "Help Desk Specialist",
        Bold: false
    },
    {
        title: "Office Coordinator",
        Bold: false
    },
    {
        title: "Client Intake Specialist",
        Bold: false
    },
    {
        title: "Intake Coordinator",
        Bold: false
    },
    {
        title: "Intake Specialist",
        Bold: false
    },
    {
        title: "Quality Assurance",
        Bold: false
    },
    {
        title: "Quality Assurance Analyst",
        Bold: false
    },
    {
        title: "Quality Assurance Specialist",
        Bold: false
    },
    {
        title: "Quality Control",
        Bold: false
    },
    {
        title: "Quality Control Analyst",
        Bold: false
    },
    {
        title: "Quality Control Specialist",
        Bold: false
    },
    {
        title: "Finance",
        Bold: true
    },
    {
        title: "Accounts Payable Manager",
        Bold: false
    },
    {
        title: "Accounts Receivable Manager",
        Bold: false
    },
    {
        title: "Billing Manager",
        Bold: false
    },
    {
        title: "Billing Specialist",
        Bold: false
    },
    {
        title: "Billing Analyst",
        Bold: false
    },
    {
        title: "Billing Clerk",
        Bold: false
    },
    {
        title: "Pricing Analyst",
        Bold: false
    },
    {
        title: "Accounts Payable Clerk",
        Bold: false
    },
    {
        title: "Accounts Receivable Clerk",
        Bold: false
    },
    {
        title: "Accounts Payable Analyst",
        Bold: false
    },
    {
        title: "Accounts Receivable Analyst",
        Bold: false
    },
    {
        title: "Accounting Clerk",
        Bold: false
    },
    {
        title: "Accounting Analyst",
        Bold: false
    },
    {
        title: "Accounting Coordinator",
        Bold: false
    },
    {
        title: "Accounting Specialist",
        Bold: false
    },
    {
        title: "Auditor",
        Bold: false
    },
    {
        title: "Bookkeeper",
        Bold: false
    },
    {
        title: "Certified Public Accountant (CPA)",
        Bold: false
    },
    {
        title: "Credit Analyst",
        Bold: false
    },
    {
        title: "Debt Collector",
        Bold: false
    },
    {
        title: "Finance Associate",
        Bold: false
    },
    {
        title: "Finance Specialist",
        Bold: false
    },
    {
        title: "Finance Analyst",
        Bold: false
    },
    {
        title: "Loan Administrator",
        Bold: false
    },
    {
        title: "Loan Processor",
        Bold: false
    },
    {
        title: "Loan Analyst",
        Bold: false
    },
    {
        title: "Payroll Specialist",
        Bold: false
    },
    {
        title: "Payment Processor",
        Bold: false
    },
    {
        title: "Payroll Analyst",
        Bold: false
    },
    {
        title: "Reconciliation Specialist",
        Bold: false
    },
    {
        title: "Reconciliation Analyst",
        Bold: false
    },
    {
        title: "Reimbursement Specialist",
        Bold: false
    },
    {
        title: "Revenue Manager",
        Bold: false
    },
    {
        title: "Revenue Analyst",
        Bold: false
    },
    {
        title: "Sales",
        Bold: true
    },
    {
        title: "Lead Generation Specialist",
        Bold: false
    },
    {
        title: "Business Development Representative",
        Bold: false
    },
    {
        title: "Sales Development Representative",
        Bold: false
    },
    {
        title: "Caller",
        Bold: false
    },
    {
        title: "CRM Analyst",
        Bold: false
    },
    {
        title: "Inside Sales Associate",
        Bold: false
    },
    {
        title: "Inside Sales Representative",
        Bold: false
    },
    {
        title: "Pricing Specialist",
        Bold: false
    },
    {
        title: "Sales Representative",
        Bold: false
    },
    {
        title: "Sales Operations Analyst",
        Bold: false
    },
    {
        title: "Marketing",
        Bold: true
    },
    {
        title: "Copywriter",
        Bold: false
    },
    {
        title: "Content Creator",
        Bold: false
    },
    {
        title: "Social Media Coordinator",
        Bold: false
    },
    {
        title: "Social Media Marketing",
        Bold: false
    },
    {
        title: "Social Media Manager",
        Bold: false
    },
    {
        title: "Affiliate Manager",
        Bold: false
    },
    {
        title: "Email Marketing Specialist",
        Bold: false
    },
    {
        title: "Influencer Marketing Associate",
        Bold: false
    },
    {
        title: "Media Assistant",
        Bold: false
    },
    {
        title: "Engineering",
        Bold: false
    },
    {
        title: "Software Engineer",
        Bold: false
    },
    {
        title: "Mobile Developer",
        Bold: false
    },
    {
        title: "Android Developer",
        Bold: false
    },
    {
        title: "iOS Developer",
        Bold: false
    },
    {
        title: "Frontend Engineer",
        Bold: false
    },
    {
        title: "Backend Engineer",
        Bold: false
    },
    {
        title: "Full-Stack Engineer",
        Bold: false
    },
    {
        title: "Software Architect",
        Bold: false
    },
    {
        title: "Security Engineer",
        Bold: false
    },
    {
        title: "Security Architect",
        Bold: false
    },
    {
        title: "Machine Learning Engineer",
        Bold: false
    },
    {
        title: "Embedded Engineer",
        Bold: false
    },
    {
        title: "Data Architect",
        Bold: false
    },
    {
        title: "Data Engineer",
        Bold: false
    },
    {
        title: "DevOps Engineer",
        Bold: false
    },
    {
        title: "Engineering Manager",
        Bold: false
    },
    {
        title: "QA Engineer",
        Bold: false
    },
    {
        title: "Data Engineer",
        Bold: false
    },
    {
        title: "Computer Programmer",
        Bold: false
    },
    {
        title: "Computer Support Specialist",
        Bold: false
    },
    {
        title: "CRM Administrator",
        Bold: false
    },
    {
        title: "Salesforce Administrator",
        Bold: false
    },
    {
        title: "SAP Administrator",
        Bold: false
    },
    {
        title: "Cyber Security Engineer",
        Bold: false
    },
    {
        title: "Information Technology Technician",
        Bold: false
    },
    {
        title: "IT Support",
        Bold: false
    },
    {
        title: "Web Developer",
        Bold: false
    },
    {
        title: "Linux Engineer",
        Bold: false
    },
    {
        title: "Middleware Engineer",
        Bold: false
    },
    {
        title: "Netsuite Administrator",
        Bold: false
    },
    {
        title: "Network Engineer",
        Bold: false
    },
    {
        title: "QA Analyst",
        Bold: false
    },
    {
        title: "QA Tester",
        Bold: false
    },
    {
        title: "Manual Tester",
        Bold: false
    },
    {
        title: "Systems Administrator",
        Bold: false
    },
    {
        title: "Systems Architect",
        Bold: false
    },
    {
        title: "Systems Engineer",
        Bold: false
    },
    {
        title: "Technical Lead",
        Bold: false
    },
    {
        title: "Technical Support Analyst",
        Bold: false
    },
    {
        title: "Technical Support Engineer",
        Bold: false
    },
    {
        title: "Shopify Developer",
        Bold: false
    },
    {
        title: "Magento Developer",
        Bold: false
    },
    {
        title: "Wordpress Developer",
        Bold: false
    },
    {
        title: "Oracle Developer",
        Bold: false
    },
    {
        title: "Cloud Architect",
        Bold: false
    },
    {
        title: "Cloud Engineer",
        Bold: false
    },
    {
        title: "Database Architect",
        Bold: false
    },
    {
        title: "Database Engineer",
        Bold: false
    },
    {
        title: "SQL Developer",
        Bold: false
    },
    {
        title: "SQL Analyst",
        Bold: false
    },
    {
        title: "Design",
        Bold: true
    },
    {
        title: "UI Designer",
        Bold: false
    },
    {
        title: "UX Designer",
        Bold: false
    },
    {
        title: "UI/UX Designer",
        Bold: false
    },
    {
        title: "Visual Designer",
        Bold: false
    },
    {
        title: "Graphic Designer",
        Bold: false
    },
    {
        title: "Illustrator",
        Bold: false
    },
    {
        title: "Product",
        Bold: true
    },
    {
        title: "Product Manager",
        Bold: false
    },
    {
        title: "Solutions Architect",
        Bold: false
    },
    {
        title: "Insurance",
        Bold: false
    },
    {
        title: "Claim Analyst",
        Bold: false
    },
    {
        title: "Claim Specialist",
        Bold: false
    },
    {
        title: "Claims Processor",
        Bold: false
    },
    {
        title: "Insurance Verification Specialist",
        Bold: false
    },
    {
        title: "Supply Chain & Logistics",
        Bold: true
    },
    {
        title: "Buyer",
        Bold: false
    },
    {
        title: "Customs Broker",
        Bold: false
    },
    {
        title: "Distribution Clerk",
        Bold: false
    },
    {
        title: "Export Coordinator",
        Bold: false
    },
    {
        title: "Import Coordinator",
        Bold: false
    },
    {
        title: "Logistics Coordinator",
        Bold: false
    },
    {
        title: "Logistics Analyst",
        Bold: false
    },
    {
        title: "Logistics Supervisor",
        Bold: false
    },
    {
        title: "Freight Coordinator",
        Bold: false
    },
    {
        title: "Inventory Analyst",
        Bold: false
    },
    {
        title: "Inventory Specialist",
        Bold: false
    },
    {
        title: "Merchandising Coordinator",
        Bold: false
    },
    {
        title: "Procurement Analyst",
        Bold: false
    },
    {
        title: "Procurement Clerk",
        Bold: false
    },
    {
        title: "Procurement Coordinator",
        Bold: false
    },
    {
        title: "Sourcing Analyst",
        Bold: false
    },
    {
        title: "Sourcing Specialist",
        Bold: false
    },
    {
        title: "Purchaser",
        Bold: false
    },
    {
        title: "Purchasing Assistant",
        Bold: false
    },
    {
        title: "Purchasing Analyst",
        Bold: false
    },
    {
        title: "Purchasing Coordinator",
        Bold: false
    },
    {
        title: "Shipping Coordinator",
        Bold: false
    },
    {
        title: "Shipping Supervisor",
        Bold: false
    },
    {
        title: "Supply Chain Analyst",
        Bold: false
    },
    {
        title: "Supply Chain Coordinator",
        Bold: false
    }
];
export const Skills = [
    {
        Name: "Customer Success"
    },
    {
        Name: "Customer Relationship Management"
    },
    {
        Name: "Customer Experience"
    },
    {
        Name: "Customer Acquisition"
    },
    {
        Name: "Cold Calling"
    },
    {
        Name: "Call Center"
    },
    {
        Name: "Prospecting"
    },
    {
        Name: "Financial Services"
    },
    {
        Name: "Sales"
    },
    {
        Name: "Salesforce"
    },
    {
        Name: "Marketing"
    },
    {
        Name: "Inside Sales"
    },
    {
        Name: "Sales Strategy"
    },
    {
        Name: "Digital Marketing"
    },
    {
        Name: "Marketing Management"
    },
    {
        Name: "Social Media Marketing"
    },
    {
        Name: "Influencer Marketing"
    },
    {
        Name: "Product Marketing"
    },
    {
        Name: "Support"
    },
    {
        Name: "Call Support"
    },
    {
        Name: "Email Support"
    },
    {
        Name: "Chat Support"
    },
    {
        Name: "Technical Support"
    },
    {
        Name: "IT Support"
    },
    {
        Name: "Application Support"
    },
    {
        Name: "Product Support"
    },
    {
        Name: "Business Analyst"
    },
    {
        Name: "Data Analyst"
    },
    {
        Name: "Analyst"
    },
    {
        Name: "Systems Analyst"
    },
    {
        Name: "Financial Analysis"
    },
    {
        Name: "Accounting"
    },
    {
        Name: "Corporate Finance"
    },
    {
        Name: "Business Finance"
    },
    {
        Name: "Decentralized Finance (DeFi)"
    },
    {
        Name: "Financial Accounting"
    },
    {
        Name: "General Accounting"
    },
    {
        Name: "Human Resources"
    },
    {
        Name: "Data Analysis"
    },
    {
        Name: "Data Entry"
    },
    {
        Name: "Data Management"
    },
    {
        Name: "Data Mining"
    },
    {
        Name: "Data Warehouse"
    },
    {
        Name: "Data Science"
    },
    {
        Name: "Data Engineering"
    },
    {
        Name: "Dashboards"
    },
    {
        Name: "Reporting"
    },
    {
        Name: "Logistics"
    },
    {
        Name: "Logistics and Supply Chain"
    },
    {
        Name: "Supply Chain"
    },
    {
        Name: "Warehousing"
    },
    {
        Name: "3PL"
    },
    {
        Name: "Third-Party Logistics"
    },
    {
        Name: "Logistics Management"
    },
    {
        Name: "Freight Management"
    },
    {
        Name: "Shipping Management"
    },
    {
        Name: "Customs Broker"
    },
    {
        Name: "Fleet Management"
    },
    {
        Name: "Dispatch Management"
    },
    {
        Name: "Shipping"
    },
    {
        Name: "Shipping and Receiving Management"
    },
    {
        Name: "Freight Forwarding"
    },
    {
        Name: "Scheduling"
    },
    {
        Name: "Lead Generation"
    },
    {
        Name: "Business Development"
    },
    {
        Name: "Slack"
    },
    {
        Name: "Hubspot"
    },
    {
        Name: "Salesforce"
    },
    {
        Name: "Microsoft Office"
    },
    {
        Name: "Microsoft Teams"
    },
    {
        Name: "Microsoft Excel"
    },
    {
        Name: "Microsoft Word"
    },
    {
        Name: "Microsoft Powerpoint"
    },
    {
        Name: "Microsoft OneNote"
    },
    {
        Name: "Shopify"
    },
    {
        Name: "Zoom"
    },
    {
        Name: "Google Docs"
    },
    {
        Name: "Google Sheets"
    },
    {
        Name: "Google Drive"
    },
    {
        Name: "Dropbox"
    },
    {
        Name: "Box"
    },
    {
        Name: "ClickUp"
    },
    {
        Name: "Airtable"
    },
    {
        Name: "LinkedIn"
    },
    {
        Name: "LinkedIn Sales Navigator"
    },
    {
        Name: "ZoomInfo"
    },
    {
        Name: "Lead Prospecting"
    },
    {
        Name: "Trello"
    },
    {
        Name: "Asana"
    },
    {
        Name: "Loom"
    },
    {
        Name: "Zapier"
    },
    {
        Name: "Notion"
    },
    {
        Name: "SAP"
    },
    {
        Name: "Oracle"
    },
    {
        Name: "Infor"
    },
    {
        Name: "Epicor"
    },
    {
        Name: "ADP"
    },
    {
        Name: "HTML"
    },
    {
        Name: "CSS"
    },
    {
        Name: "Java"
    },
    {
        Name: "Javascript"
    },
    {
        Name: "React"
    },
    {
        Name: "React Native"
    },
    {
        Name: "Angular"
    },
    {
        Name: "VueJS"
    },
    {
        Name: "jQuery"
    },
    {
        Name: "PHP"
    },
    {
        Name: "Swift"
    },
    {
        Name: "Flutter"
    },
    {
        Name: "TypeScript"
    },
    {
        Name: "Elm"
    },
    {
        Name: "MEAN Stack"
    },
    {
        Name: "MERN Stack"
    },
    {
        Name: "Angular"
    },
    {
        Name: "Python"
    },
    {
        Name: "Ruby"
    },
    {
        Name: "SQL"
    },
    {
        Name: "Golang"
    },
    {
        Name: "C#"
    },
    {
        Name: "C"
    },
    {
        Name: "C++"
    },
    {
        Name: "Ruby on Rails"
    },
    {
        Name: "Perl"
    },
    {
        Name: "MongoDB"
    },
    {
        Name: "Magento"
    },
    {
        Name: "Wordpress"
    },
    {
        Name: "Adobe Illustrator"
    },
    {
        Name: "Adobe Creative Suite"
    },
    {
        Name: "Adobe Photoshop"
    },
    {
        Name: "Figma"
    },
    {
        Name: "WooCommerce"
    },
    {
        Name: "Squarespace"
    },
    {
        Name: "Adobe Premiere Pro"
    },
    {
        Name: "Adobe Indesign"
    },
    {
        Name: "Sketch"
    },
    {
        Name: "Kotlin"
    },
    {
        Name: "Jira"
    },
    {
        Name: "Github"
    },
    {
        Name: "Gitlab"
    },
    {
        Name: "Confluence"
    },
    {
        Name: "Bitbucket"
    },
    {
        Name: "Linear"
    },
    {
        Name: "Node"
    },
    {
        Name: "Redux"
    },
    {
        Name: "Express"
    },
    {
        Name: "CRM"
    },
    {
        Name: ".NET"
    },
    {
        Name: "Drupal"
    },
    {
        Name: "Netsuite"
    },
    {
        Name: "Scrum"
    }
];