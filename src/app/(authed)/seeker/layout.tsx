import { Layout } from "@/components/shared/layouts/Layout";
import { getRole } from "@/libs/utils/authUtils";
import { Role } from "@/libs/utils/constants";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutSeeker = async ({ children }: LayoutProps) => {
  const role = await getRole();

  if (role !== Role["JOB_SEEKER"]) {
    return (
      <div>Không có quyền truy cập, trang này chỉ dành cho người tìm việc</div>
    );
  }

  return <>{children}</>;
};

export default LayoutSeeker;
