import { Layout, Menu } from 'antd';
import { adminPaths } from '../../routes/admin.routes';
import { sidebarItemsGenerator } from '../../utils/sidebarItemsGenerator';
import { facultyPaths } from '../../routes/faculty.routes';
import { studentPaths } from '../../routes/student.route';

const { Sider } = Layout;

const userRole = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

const SideBar = () => {
  const role = 'student';
  let sidebarItems;

  switch (role) {
    case userRole.ADMIN:
      sidebarItems = sidebarItemsGenerator(adminPaths, userRole.ADMIN);
      break;
    case userRole.FACULTY:
      sidebarItems = sidebarItemsGenerator(facultyPaths, userRole.FACULTY);
      break;
    case userRole.STUDENT:
      sidebarItems = sidebarItemsGenerator(studentPaths, userRole.STUDENT);
      break;

    default:
      break;
  }

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div
        style={{
          color: 'white',
          height: '4rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>SM Uni</h1>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={sidebarItems} />
    </Sider>
  );
};

export default SideBar;
