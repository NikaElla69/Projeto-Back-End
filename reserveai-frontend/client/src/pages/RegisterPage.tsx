/**
 * Design philosophy for registration: welcome new diners with clarity, making each field feel intentional and beginner-friendly.
 */
import { AuthSplitLayout } from '@/components/forms/AuthSplitLayout';
import { RegisterForm } from '@/components/forms/RegisterForm';

export function RegisterPage() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <AuthSplitLayout
          alternateAction="Fazer login"
          alternateHref="/login"
          alternateLabel="Já possui conta?"
          description="O cadastro utiliza a rota de autenticação do back-end. Após a criação, o token JWT já deixa o usuário autenticado para listar e criar reservas."
          eyebrow="Cadastro"
          title="Abra sua porta de entrada para reservar mesas com rapidez"
        >
          <RegisterForm />
        </AuthSplitLayout>
      </div>
    </section>
  );
}
