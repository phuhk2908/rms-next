type Success<T> = {
   status: "success";
   message: "";
   data: T;
   error: null;
};

type Failure<E> = {
   status: "error";
   message: "";
   data: null;
   error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
   promiseOrFn: Promise<T> | (() => Promise<T>),
): Promise<Result<T, E>> {
   try {
      const data =
         typeof promiseOrFn === "function"
            ? await promiseOrFn()
            : await promiseOrFn;
      return { status: "success", message: "", data, error: null };
   } catch (error) {
      return { status: "error", message: "", data: null, error: error as E };
   }
}
