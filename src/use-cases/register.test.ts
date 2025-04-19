import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";

describe("register use case", () => {
  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "styven",
      email: "styven@example.com.br",
      password: "654321",
    });

    const isPasswordCorrectlyHashed = await compare(
      "654321",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "styven",
      email: "styven@example.com.br",
      password: "654321",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "styven@example.com";

    await registerUseCase.execute({
      name: "Styven",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Styven",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
