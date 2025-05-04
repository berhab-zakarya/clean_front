# Reusable Components

This directory contains reusable components that can be used across the application.

## Guidelines

1. Create components that extend shadcn/ui components with custom styling
2. Ensure components are type-safe with TypeScript
3. Document component props and usage examples
4. Make sure all components support dark mode
5. Fix all version problems

---

## How to Use All Common Components

All components in the `common` folder are built on top of shadcn/ui components with custom design and support for your project's color palette and fonts.

---

### Input

```tsx
import { Input } from "@/components/common/Input";
import { User } from "lucide-react";

<Input
  label="Full Name"
  placeholder="Enter your fullname"
  variant="primary"
  radius="full"
  leftIcon={<User size={20} />}
/>

<Input
  variant="error"
  placeholder="With error"
  error="This field is required"
/>
```

---

### Button

```tsx
import { Button } from "@/components/common/Button";
import { ArrowRight } from "lucide-react";

<Button variant="primary" size="md">
  Primary Button
</Button>

<Button
  variant="secondary-outline"
  size="lg"
  isFullWidth
  leftIcon={<ArrowRight size={16} />}
>
  Next Step
</Button>

<Button variant="primary" loading>
  Loading...
</Button>
```

---

### Checkbox

```tsx
import { Checkbox } from "@/components/common/Checkbox";

<Checkbox label="I agree to terms" color="success" />
<Checkbox label="Disabled" color="neutral" disabled />
```

---

### Switch

```tsx
import { Switch } from "@/components/common/Switch";

<Switch label="Enable notifications" color="primary" />
<Switch label="Disabled" color="neutral" disabled />
```

---

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";

<Card bgColor="bg-primary-100" shadow="lg" radius="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here.
  </CardContent>
</Card>
```

---

### Alert

```tsx
import { Alert } from "@/components/common/Alert";
import { AlertTriangle } from "lucide-react";

<Alert color="warning" title="Attention!" icon={<AlertTriangle />}>
  This is a warning alert.
</Alert>
```

---

### Slider

```tsx
import { Slider } from "@/components/common/Slider";

<Slider min={0} max={100} showTooltip />
```

---

> **Note:**  
> All components support your custom colors, fonts, and dark mode automatically.