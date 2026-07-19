export default interface ConfirmDialogEntity {
  message: string;
  onConfirm?:() => void     
  onCancel?: () => void;      
}