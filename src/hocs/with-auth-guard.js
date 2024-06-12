import { AuthGuard } from 'src/guards/auth-guard';

export const withAuthGuard = Component => props => {
  console.log(props);
  const component = (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  );
  return component;
};
