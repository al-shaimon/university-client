import { Button, Modal, Pagination, Space, Table, TableColumnsType, TableProps } from 'antd';
import { useState } from 'react';
import { TQueryParam, TStudent } from '../../../types';
import { useGetAllStudentsQuery } from '../../../redux/features/admin/userManagement.api';
import { Link } from 'react-router-dom';

export type TTableData = Pick<TStudent, 'fullName' | 'id' | 'email' | 'contactNo'>;

const StudentData = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: studentData,
    isLoading,
    isFetching,
  } = useGetAllStudentsQuery([
    // { name: 'limit', value: 3 },
    { name: 'page', value: page },
    { name: 'sort', value: 'id' },
    ...params,
  ]);

  console.log({ isLoading, isFetching });

  const metaData = studentData?.meta;

  const tableData = studentData?.data?.map(({ _id, fullName, id, email, contactNo }) => ({
    key: _id,
    fullName,
    id,
    email,
    contactNo,
  }));

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: TableColumnsType<TTableData> = [
    {
      title: 'Name',
      key: 'fullName',
      dataIndex: 'fullName',
    },
    {
      title: 'Roll No',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Contact No.',
      key: 'contactNo',
      dataIndex: 'contactNo',
    },
    {
      title: 'Action',
      key: 'x',
      render: (item) => {
        console.log(item);
        return (
          <div>
            <Space>
              <Link to={`/admin/student-data/${item?.key}`}>
                <Button>Details</Button>
              </Link>
              <Button>Update</Button>
              <Button onClick={showModal}>Block</Button>
            </Space>
          </div>
        );
      },
      width: '10%',
    },
  ];

  const onChange: TableProps<TTableData>['onChange'] = (_pagination, filters, _sorter, extra) => {
    if (extra.action === 'filter') {
      const queryParams: TQueryParam[] = [];

      filters.name?.forEach((item) => queryParams.push({ name: 'name', value: item }));
      filters.year?.forEach((item) => queryParams.push({ name: 'year', value: item }));

      setParams(queryParams);
    }
  };

  return (
    <>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        pagination={false}
      />
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
      </Modal>
      <Pagination
        current={page}
        onChange={(value) => setPage(value)}
        pageSize={metaData?.limit}
        total={metaData?.total}
      />
    </>
  );
};

export default StudentData;
