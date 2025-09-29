// app/administration/users/page.jsx
import UsersTable from "@/components/Administration/UsersTable";

const page = () => {
  // Later you can fetch users here with RTK Query or server API
  return <UsersTable />;
};
export default page;
