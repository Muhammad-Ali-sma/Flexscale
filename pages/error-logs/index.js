import Head from "next/head";
import { Box } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { INTERNAL_ADMIN } from '../../utils';
import { DataGrid } from '@mui/x-data-grid';
import { ErrorLogColumns } from "../../utils/data";
import { selectAuth } from "../../store/authSlice";
import Loader from '../../components/global/Loader';
import UserService from '../../Services/UserService';
import { Layout } from '../../components/global/Layout';
import { BodyHeader } from '../../components/global/BodyHeader';

export default function ErrorLogs() {
    const user = useSelector(selectAuth)?.userData;
    const queryClient = useQueryClient();

    const { data: list, isLoading } = useQuery(['getErrorLogs'], () => UserService.getErrorLogs(), {
        enabled: user?.AccessLevel === INTERNAL_ADMIN.level ? true : false
    });

    const deletAllLogs = useMutation(() => UserService.deleteErrorLogs(), {
        onSettled: (res) => {
            queryClient.invalidateQueries({ queryKey: 'getErrorLogs' });
        }
    })

    return (
        <>
            <Head>
                <title>Error Logs | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={'Error Logs'}
                    containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
                    handleRemove={() => { deletAllLogs.mutate() }}
                    removeBtnTitle="Clear All Logs"
                />
                {!isLoading ?
                    <>
                        <Box sx={{ width: '100%', background: "white" }}>
                            <DataGrid
                                getRowId={(row) => row._id}
                                autoHeight={true}
                                showColumnRightBorder={false}
                                columns={ErrorLogColumns}
                                hideFooterSelectedRowCount={true}
                                pageSize={20}
                                rows={list?.data ?? []}
                                editMode='row'
                                rowsPerPageOptions={[5, 10, 20, 50]}
                            />
                        </Box>
                    </>
                    :
                    <Loader
                        show={isLoading}
                    />
                }
            </Layout>
        </>
    );
}

