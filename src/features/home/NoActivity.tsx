import { UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button, EmptyState } from '../../components'

export function NoActivity() {
  const navigate = useNavigate()
  return (
    <EmptyState
      icon={UserPlus}
      title="Aún no hay actividad"
      description="Cuando agregues amigos, aquí vas a ver qué están leyendo."
      action={<Button onClick={() => navigate('/amigos')}>Buscar amigos</Button>}
    />
  )
}
