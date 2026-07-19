import type ConfirmDialogEntity from "./confirm_dialog_entity";

export default function ConfirmDialog({ message, onConfirm,  onCancel }: ConfirmDialogEntity) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <p className="text-gray-800 text-center mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          
           <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >Estoy seguro</button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}