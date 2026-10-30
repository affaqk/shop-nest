import Modal from './Modal'
import { dangerButton, secondaryButton } from './styles'

const ConfirmDialog = ({ title, message, onConfirm, onCancel, busy }) => (
  <Modal title={title} onClose={onCancel}>
    <p className="text-sm text-slate-600">{message}</p>
    <div className="mt-8 flex justify-end gap-3">
      <button onClick={onCancel} className={secondaryButton}>Cancel</button>
      <button onClick={onConfirm} disabled={busy} className={dangerButton}>
        {busy ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </Modal>
)

export default ConfirmDialog
