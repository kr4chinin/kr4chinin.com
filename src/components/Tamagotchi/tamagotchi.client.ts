type Mode = 'cat' | 'frog' | 'fish';

const PET_SIZE = 48;
const HINT_DELAY_MS = 3000;

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function spawnSplash(cx: number, cy: number) {
	const splash = document.createElement('div');
	splash.className = 'frog-splash';
	splash.style.left = `${cx}px`;
	splash.style.top = `${cy}px`;
	splash.innerHTML =
		'<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
		'<rect x="2" y="6" width="2" height="2" fill="#7ec850"/>' +
		'<rect x="12" y="6" width="2" height="2" fill="#5a9c39"/>' +
		'<rect x="6" y="2" width="2" height="2" fill="#bce39a"/>' +
		'<rect x="6" y="12" width="2" height="2" fill="#7ec850"/>' +
		'<rect x="3" y="3" width="1" height="1" fill="#bce39a"/>' +
		'<rect x="12" y="3" width="1" height="1" fill="#5a9c39"/>' +
		'<rect x="3" y="12" width="1" height="1" fill="#7ec850"/>' +
		'<rect x="12" y="12" width="1" height="1" fill="#bce39a"/>' +
		'</svg>';
	document.body.appendChild(splash);
	window.setTimeout(() => splash.remove(), 700);
}

export function initTamagotchi() {
	const root = document.getElementById('tamagotchi');
	const button = root?.querySelector<HTMLButtonElement>('.pet-button');
	const hint = document.getElementById('pet-hint');

	if (!root || !button) return;

	let mode: Mode = 'cat';
	let chaosTimer: number | null = null;
	let swimTimer: number | null = null;
	let bubbleTimer: number | null = null;

	let prevX = 0;
	let prevY = 0;
	let hasJumped = false;

	let swimX = 0;
	let swimY = 0;

	function jump() {
		const maxStep = 360;
		const dx = (Math.random() - 0.5) * maxStep * 2;
		const dy = (Math.random() - 0.5) * maxStep * 2;
		const x = clamp(Math.floor(prevX + dx), 0, Math.max(window.innerWidth - PET_SIZE, 0));
		const y = clamp(Math.floor(prevY + dy), 0, Math.max(window.innerHeight - PET_SIZE, 0));
		const r = Math.floor((Math.random() - 0.5) * 18);
		const flip = x < prevX ? -1 : 1;

		if (hasJumped) {
			spawnSplash(prevX + PET_SIZE / 2, prevY + PET_SIZE / 2);
		}

		prevX = x;
		prevY = y;
		hasJumped = true;

		root!.style.setProperty('--fx', `${x}px`);
		root!.style.setProperty('--fy', `${y}px`);
		root!.style.setProperty('--fr', `${r}deg`);
		root!.style.setProperty('--fsx', String(flip));

		chaosTimer = window.setTimeout(jump, 850 + Math.random() * 700);
	}

	function startChaos() {
		prevX = 0;
		prevY = Math.max(window.innerHeight - PET_SIZE, 0);
		hasJumped = false;
		jump();
	}

	function stopChaos() {
		if (chaosTimer !== null) {
			clearTimeout(chaosTimer);
			chaosTimer = null;
		}
		root!.style.removeProperty('--fx');
		root!.style.removeProperty('--fy');
		root!.style.removeProperty('--fr');
		root!.style.removeProperty('--fsx');
	}

	function swim() {
		const margin = PET_SIZE;
		const maxX = Math.max(window.innerWidth - margin, margin);
		const maxY = Math.max(window.innerHeight - margin, margin);
		const targetX = Math.floor(margin / 2 + Math.random() * Math.max(maxX - margin, 1));
		const targetY = Math.floor(margin / 2 + Math.random() * Math.max(maxY - margin, 1));
		const flip = targetX < swimX ? -1 : 1;
		swimX = targetX;
		swimY = targetY;
		root!.style.setProperty('--sx', `${targetX}px`);
		root!.style.setProperty('--sy', `${targetY}px`);
		root!.style.setProperty('--ssx', String(flip));
		swimTimer = window.setTimeout(swim, 3400 + Math.random() * 1400);
	}

	function startSwim() {
		swimX = Math.floor(window.innerWidth / 2);
		swimY = Math.floor(window.innerHeight / 2);
		swim();
	}

	function stopSwim() {
		if (swimTimer !== null) {
			clearTimeout(swimTimer);
			swimTimer = null;
		}
		root!.style.removeProperty('--sx');
		root!.style.removeProperty('--sy');
		root!.style.removeProperty('--ssx');
	}

	function spawnBubble() {
		const rect = root!.getBoundingClientRect();
		if (rect.width === 0) return;
		const facing = parseFloat(getComputedStyle(root!).getPropertyValue('--ssx')) || 1;
		const tailOffset = -facing * (rect.width * 0.32);
		const cx = rect.left + rect.width / 2 + tailOffset + (Math.random() - 0.5) * 8;
		const cy = rect.top + rect.height / 2 + (Math.random() - 0.5) * 6;
		const size = 5 + Math.random() * 5;
		const drift = (Math.random() - 0.5) * 14;

		const bubble = document.createElement('div');
		bubble.className = 'fish-bubble';
		bubble.style.left = `${cx}px`;
		bubble.style.top = `${cy}px`;
		bubble.style.width = `${size}px`;
		bubble.style.height = `${size}px`;
		bubble.style.setProperty('--bubble-drift', `${drift}px`);
		document.body.appendChild(bubble);
		window.setTimeout(() => bubble.remove(), 2000);
	}

	function startBubbles() {
		function tick() {
			spawnBubble();
			bubbleTimer = window.setTimeout(tick, 550 + Math.random() * 700);
		}
		bubbleTimer = window.setTimeout(tick, 350);
	}

	function stopBubbles() {
		if (bubbleTimer !== null) {
			clearTimeout(bubbleTimer);
			bubbleTimer = null;
		}
	}

	let hintDismissed = false;
	let hintTimer: number | null = null;
	let hintRaf: number | null = null;

	function followHintToCat() {
		if (!hint) return;
		const rect = root!.getBoundingClientRect();
		hint.style.left = `${rect.left + rect.width / 2}px`;
		hint.style.top = `${rect.top - 8}px`;
		hintRaf = requestAnimationFrame(followHintToCat);
	}

	function showHint() {
		if (!hint || hintDismissed) return;
		hint.classList.add('show');
		followHintToCat();
	}

	function hideHint() {
		if (hintDismissed) return;
		hintDismissed = true;
		hint?.classList.remove('show');
		if (hintTimer !== null) {
			clearTimeout(hintTimer);
			hintTimer = null;
		}
		if (hintRaf !== null) {
			cancelAnimationFrame(hintRaf);
			hintRaf = null;
		}
	}

	if (!hintDismissed && hint) {
		hintTimer = window.setTimeout(showHint, HINT_DELAY_MS);
	}

	button.addEventListener('click', () => {
		hideHint();
		const next: Mode = mode === 'cat' ? 'frog' : mode === 'frog' ? 'fish' : 'cat';

		root.classList.remove('puffing');
		void root.offsetWidth;
		root.classList.add('puffing');

		if (mode === 'frog') stopChaos();
		if (mode === 'fish') {
			stopSwim();
			stopBubbles();
		}

		root.classList.toggle('frog', next === 'frog');
		root.classList.toggle('fish', next === 'fish');

		if (next === 'frog') startChaos();
		if (next === 'fish') {
			startSwim();
			startBubbles();
		}

		mode = next;
	});
}
