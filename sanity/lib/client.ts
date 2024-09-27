import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "../env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token:
    "skGf4qRGnEeP43UdGloyHTNbp7JjTh6z5klmwlmVbcwRvppsDtpF49a3Vk2NvhMI0AfvCTgJqa09Ak5Gl7GnN8UxFWD4cHyEnJ1oVJlUdjWoRFRd8ziuo4Xio83F6LxtmvYQkdMVP97K4hMZSaKNcpxEyvxno9OoRerOQqsGL0THFpbUgNsk",
});
