import { useState } from 'react'
import { Modal } from '../ui/modal'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'
import PrintCardForm from './PrintCardForm'
import { RequestResponseModel } from '../../store/server/requets/interfaces'

const PrintCardModal = ({ data, onClose }: { data: RequestResponseModel["helpRequests"][number]; onClose: () => void }) => {
  const [pending, setPending] = useState(false);
  return (
    <>
    {pending && (
      <div className="fixed top-0 left-0 flex justify-center items-center h-full bg-black/40 w-screen z-[999]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )}
      <Modal
        isOpen={true}
        onClose={onClose}
        className={clsx("max-w-6xl m-4", pending && "opacity-0")}
      >
        <PrintCardForm data={data} pending={pending} setPending={setPending} />
      </Modal>
    </>
  )
}

export default PrintCardModal