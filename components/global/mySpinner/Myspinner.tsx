import "./spinner.css";

type Props = {};

const MySpinner = (props: Props) => {
  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-transparent">
      <span className="spinner"></span>
    </div>
  );
};

export default MySpinner;
