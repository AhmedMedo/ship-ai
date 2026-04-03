// Custom error page to prevent Next.js default _error from importing next/document Html.
// All actual error handling uses App Router error.tsx files.
function ErrorPage() {
  return null;
}

ErrorPage.getInitialProps = () => ({ statusCode: 500 });

export default ErrorPage;
