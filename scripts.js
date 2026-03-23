document.addEventListener('DOMContentLoaded', () => {
	// seleciona o header
	const header = document.querySelector('header');
	if (!header) return;

	// começa escondido para evitar flash visual
	header.classList.add('header-hidden');

	// IntersectionObserver para alternar classes quando o header entrar/sair da viewport
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				header.classList.add('header-visible');
				header.classList.remove('header-hidden');
			} else {
				header.classList.add('header-hidden');
				header.classList.remove('header-visible');
			}
		});
	}, {
		threshold: 0.05
	});

	observer.observe(header);

	// NOVO: animação das sessões e sequência de cards na sessão de projetos
	(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const sessoes = document.querySelectorAll('.sessao');
		if (!sessoes.length) return;

		// inicializa como invisível para evitar flash
		sessoes.forEach(s => s.classList.add('sessao-hidden'));

		const sessaoObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				const el = entry.target;

				if (entry.isIntersecting) {
					// torna visível
					el.classList.add('sessao-visible');
					el.classList.remove('sessao-hidden');

					// animação sequencial dos cards dentro desta sessão (se houver)
					if (!reduceMotion) {
						const cards = el.querySelectorAll('.card-projeto');
						cards.forEach((card, i) => {
							// limpa qualquer animação anterior
							card.style.animation = 'none';
							// força reflow para reiniciar a animação se necessário
							/* eslint-disable no-unused-expressions */
							card.offsetHeight;
							/* eslint-enable no-unused-expressions */

							// aplica animação com atraso sequencial (80ms por item)
							const delay = i * 400; // ms
							card.style.animation = `cardFadeUp 520ms cubic-bezier(.22,.9,.3,1) both`;
							card.style.animationDelay = `${delay}ms`;
						});
					} else {
						// se reduzir movimento, garante estado visível sem animação
						el.querySelectorAll('.card-projeto').forEach(card => {
							card.style.animation = 'none';
							card.style.animationDelay = '';
						});
					}
				} else {
					// torna invisível novamente e limpa animações
					el.classList.remove('sessao-visible');
					el.classList.add('sessao-hidden');

					el.querySelectorAll('.card-projeto').forEach(card => {
						card.style.animation = 'none';
						card.style.animationDelay = '';
					});
				}
			});
		}, {
			threshold: 0.12
		});

		sessoes.forEach(s => sessaoObserver.observe(s));
	})();
	
	// Garantir que ao carregar a página (refresh) o header se anime se já estiver visível
	requestAnimationFrame(() => {
		setTimeout(() => {
			const rect = header.getBoundingClientRect();
			const inView = rect.top < window.innerHeight && rect.bottom > 0;
			if (inView) {
				header.classList.add('header-visible');
				header.classList.remove('header-hidden');
			}
		}, 50); // pequeno delay para evitar layout flash
	});
});
