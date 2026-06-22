import Header from '@/components/layout/Header'
import ContactForm from '@/components/contacts/ContactForm'

export default function NewContactPage() {
  return (
    <div>
      <Header title="Nuovo contatto" subtitle="Inserisci i dati del nuovo contatto" />
      <ContactForm />
    </div>
  )
}
