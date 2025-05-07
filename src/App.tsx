import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";

export const AddressesDataSchema = z
  .object({
    separateBillingAddress: z.boolean(),
    mailingAddress: z.string().trim().min(1),
    billingAddress: z.string().trim(),
  })
  .superRefine((val, ctx) => {
    if (val.separateBillingAddress) {
      if (!val.billingAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing address is required.",
          path: ["billingAddress"],
        });
      }
    }
  });
// export const AddressesDataSchema = z.discriminatedUnion(
//   "separateBillingAddress",
//   [
//     z.object({
//       separateBillingAddress: z.literal(false),
//       mailingAddress: z.string().trim().min(1),
//       billingAddress: z.string().optional(),
//     }),
//     z.object({
//       separateBillingAddress: z.literal(true),
//       mailingAddress: z.string().trim().min(1),
//       billingAddress: z.string().trim().min(1),
//     }),
//   ]
// );
export type AddressesData = z.input<typeof AddressesDataSchema>;

function App() {
  const defaultValues: AddressesData = {
    separateBillingAddress: false,
    mailingAddress: "",
    billingAddress: "",
  };
  const form = useForm({
    defaultValues,
    validators: {
      onChange: AddressesDataSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Success", value);
    },
  });
  const separateAddresses = useStore(
    form.store,
    ({ values }) => values.separateBillingAddress
  );
  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field
            name="mailingAddress"
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>Mailing Address:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="separateBillingAddress"
            children={(field) => {
              return (
                <div>
                  Billing address:
                  <div>
                    <input
                      type="radio"
                      id="same"
                      name={field.name}
                      value="same"
                      checked={!field.state.value}
                      onChange={() => {
                        field.handleChange(false);
                      }}
                    />
                    <label htmlFor="same">Same as mailing address</label>
                    <br />
                    <input
                      type="radio"
                      id="separate"
                      checked={field.state.value}
                      name={field.name}
                      value="separate"
                      onChange={() => {
                        field.handleChange(true);
                      }}
                    />
                    <label htmlFor="separate">Different address</label>
                  </div>
                </div>
              );
            }}
          />
        </div>
        <div hidden={!separateAddresses}>
          <form.Field
            name="billingAddress"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Billing Address:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <>
              <button type="submit">{isSubmitting ? "..." : "Submit"}</button>
              <button type="reset" onClick={() => form.reset()}>
                Reset
              </button>
            </>
          )}
        />
      </form>
    </div>
  );
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em style={{ color: "red" }}>
          {field.state.meta.errors.map((e) => e.message).join(",")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default App;
