/**
 * Design philosophy for login: turn authentication into a calm, guided checkpoint with clarity about API integration.
 */
import { AuthSplitLayout } from '@/components/forms/AuthSplitLayout';
import { LoginForm } from '@/components/forms/LoginForm';

export function LoginPage() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <AuthSplitLayout
          alternateAction="Criar conta"
          alternateHref="/register"
          alternateLabel="Ainda não possui acesso?"
          description="Entre com as mesmas credenciais cadastradas na API do ReserveAí. O token JWT retornado será salvo localmente para proteger as rotas privadas do sistema."
          eyebrow="Autenticação"
          title="Faça login para gerenciar suas reservas"
        >
          <LoginForm />
        </AuthSplitLayout>
      </div>
    </section>
  );
}
