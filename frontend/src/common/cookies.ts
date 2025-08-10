import Cookies from "js-cookie";

export async function getCookiesData(name: string) {
  const data = Cookies.get(name);
  return data;
}

export async function removeCookiesData(name: string): Promise<boolean> {
  try {
    if (Cookies.get(name)) {
      Cookies.remove(name);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function removeCookiesSignIn(name: string): Promise<boolean> {
  try {
    if (!Cookies.get(name)) {
      return false;
    }

    const domains = ["localhost", "berli.app"];

    domains.forEach((domain) => {
      Cookies.remove(name, { domain, path: "/" });
    });

    return true;
  } catch (error) {
    return false;
  }
}

export function setCookiesData(
  name: string,
  value: string,
  expires: number,
  sameSite: "strict" | "Strict" | "lax" | "Lax" | "none" | "None",
): void {
  Cookies.set(name, value, { expires: expires, path: "/", sameSite: sameSite });
}
