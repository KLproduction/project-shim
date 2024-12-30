import "./loader.css";

type Props = {};

const MyLoader = (props: Props) => {
  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-transparent">
      <span className="loader"></span>
    </div>
  );
};

export default MyLoader;
