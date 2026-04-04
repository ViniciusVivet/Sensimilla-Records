"use client";

import { useState, FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const action = process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION?.trim();

    if (action) {
      const form = e.currentTarget;
      void fetch(action, {
        method: "POST",
        body: new FormData(form),
      })
        .then((res) => {
          setStatus(res.ok ? "sent" : "error");
        })
        .catch(() => setStatus("error"));
      return;
    }

    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const subject = data.get("subject");
    const message = data.get("message");
    console.info("[Contato — mock]", { name, email, subject, message });
    setStatus("sent");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-panel/40 p-6 md:p-8"
      noValidate
    >
      <div>
        <label htmlFor="name" className="block text-xs uppercase tracking-wider text-muted">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-4 py-3 text-fg outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-xs uppercase tracking-wider text-muted">
          Motivo
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-4 py-3 text-fg outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
        >
          <option value="">Selecione...</option>
          <option value="booking">Booking / Shows</option>
          <option value="imprensa">Imprensa / Press</option>
          <option value="collab">Collab / Parceria</option>
          <option value="geral">Geral</option>
        </select>
      </div>
      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-wider text-muted">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-4 py-3 text-fg outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-wider text-muted">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-bg/80 px-4 py-3 text-fg outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-bg transition hover:opacity-90 md:w-auto md:px-10"
      >
        Enviar
      </button>

      {status === "sent" && (
        <p className="text-sm text-accent" role="status">
          {process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION
            ? "Mensagem enviada. Obrigado."
            : "Registrado localmente (modo demonstração). Configure NEXT_PUBLIC_CONTACT_FORM_ACTION no .env para enviar a um endpoint real."}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          Não foi possível enviar. Tente de novo mais tarde.
        </p>
      )}
    </form>
  );
}
