import { useParams } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import PageHeader from "../components/PageHeader";

const ErrorRouter = () => {
  const { code } = useParams();
  const errorCode = parseInt(code) || 404;
  return (
    <div>
      <PageHeader
        title={`Error ${errorCode}`}
        breadcrumb={["Beranda", "Halaman Error", `Error ${errorCode}`]}
      />
      <ErrorPage errorCode={errorCode} />
    </div>
  );
};

export default ErrorRouter;
