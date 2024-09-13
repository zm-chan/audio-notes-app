import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import BaseButton from "./BaseButton";
import { forwardRef } from "react";

const EncryptionButton = forwardRef(function EncryptionButton(
  { encrypted, ...props },
  ref,
) {
  return (
    <BaseButton
      ref={ref}
      {...props}
      message={encrypted ? "Decrypt Content" : "Encrypt Content"}
    >
      {encrypted ? <LockKeyholeOpen /> : <LockKeyhole />}
    </BaseButton>
  );
});

export default EncryptionButton;
