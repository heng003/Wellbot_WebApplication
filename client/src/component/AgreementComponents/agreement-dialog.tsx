import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useNavigate } from "react-router-dom";

interface AgreementDialogProps {
  aboveTitleChildren?: React.ReactNode;
  triggerText: string;
  title: string;
  description?: string;
  labelTextArr?: string[];
  closeText: string;
  closeHref?: string;
}

export function AgreementDialog({
  triggerText,
  title,
  description,
  labelTextArr,
  closeText,
  closeHref,
  aboveTitleChildren,
}: AgreementDialogProps) {
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-4 px-4 py-2 font-semibold rounded-lg text-white bg-dark-orange">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {aboveTitleChildren}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {labelTextArr &&
          labelTextArr.map((labelText, index) => (
            <div className="grid gap-4 py-4" key={index}>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={labelText} className="text-right">
                  {labelText}
                </Label>
                <Input
                  id={labelText}
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
            </div>
          ))}

        <DialogFooter>
          <Button
            onClick={() => {
              closeHref && navigate(closeHref);
            }}
            className="my-4 px-4 py-2 font-semibold rounded-lg text-white bg-dark-orange"
            type="submit"
          >
            {closeText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
