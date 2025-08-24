import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { Euro, TicketPercent } from 'lucide-react';

export default function InputDemo() {
  return (
    <div className="space-y-5 w-80">
      <InputGroup>
        <InputAddon>Addon</InputAddon>
        <Input type="email" placeholder="Start addon" />
      </InputGroup>
      <InputGroup>
        <Input type="email" placeholder="End addon" />
        <InputAddon>Addon</InputAddon>
      </InputGroup>
      <InputGroup>
        <InputAddon mode="icon">
          <Euro />
        </InputAddon>
        <Input type="email" placeholder="Start icon addon" />
      </InputGroup>
      <InputGroup>
        <Input type="email" placeholder="End icon addon" />
        <InputAddon mode="icon">
          <TicketPercent />
        </InputAddon>
      </InputGroup>
    </div>
  );
}
