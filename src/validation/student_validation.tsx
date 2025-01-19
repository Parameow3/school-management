import * as yup from 'yup';

export const userSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .required("Age is required"),
  gender: yup.string().oneOf(["Male", "Female"], "Gender must be Male or Female"),
  dob: yup
    .date()
    .typeError("Date of birth must be a valid date")
    .required("Date of birth is required"),
  pob: yup.string().required("Place of birth is required"),
  nationality: yup.string().required("Nationality is required"),
  belt_level: yup.string().required("Belt level is required"),
  phone: yup
    .string()
    .matches(
      /^[0-9]+$/,
      "Phone number must contain only numbers"
    )
    .required("Phone number is required"),
  email: yup
    .string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  mother_name: yup.string().required("Mother's name is required"),
  mother_occupation: yup.string().required("Mother's occupation is required"),
  father_name: yup.string().required("Father's name is required"),
  father_occupation: yup.string().required("Father's occupation is required"),
  address: yup.string().required("Address is required"),
  parent_contact: yup
    .string()
    .matches(
      /^[0-9]+$/,
      "Parent contact must contain only numbers"
    )
    .required("Parent contact is required"),
  student_passport: yup.string().required("Student passport is required"),
  admission_date: yup
    .date()
    .typeError("Admission date must be a valid date")
    .required("Admission date is required"),
  branch: yup
    .number()
    .nullable()
    .typeError("Branch must be a number")
    .required("Branch is required"),
  image: yup
    .mixed()
    .nullable()
    .test(
      "fileSize",
      "Image size must be less than 2MB",
      (value) => !value || (value instanceof File && value.size <= 2 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Image must be a valid image file",
      (value) => !value || (value instanceof File && ["image/jpeg", "image/png"].includes(value.type))
    ),
  classrooms: yup
    .array()
    .of(yup.string())
    .required("At least one classroom must be selected"),
});
