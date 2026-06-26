import Header from '@/components/layout/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ContactForm from '@/components/contacts/ContactForm'

export default function NewContactPage() {
  return (
    <div>
      <Breadcrumb crumbs={[{ label: 'Contatti', href: '/contacts' }, { label: 'Nuovo contatto' }]} />
      <Header title="Nuovo contatto" subtitle="Inserisci i dati del nuovo contatto" />
      <ContactForm />
    </div>
  )
}
