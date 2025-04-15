
import { generateQRCodeURL } from "@/lib/utils";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 200, className = "" }: QRCodeProps) {
  const qrCodeUrl = generateQRCodeURL(value);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={qrCodeUrl} 
        alt="QR Code" 
        width={size} 
        height={size} 
        className="rounded-md shadow-sm"
      />
    </div>
  );
}
