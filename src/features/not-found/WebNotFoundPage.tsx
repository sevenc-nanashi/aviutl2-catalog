import NotFoundPage from './NotFoundPage';

export function loader() {
  return new Response(null, { status: 404 });
}

export default NotFoundPage;
