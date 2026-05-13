import $ from "jquery";

function renderItem(vm, selector = ".w-jx3-element") {
    let outer, inner;
    const pop_class = ".w-jx3-element-pop";
    const scopeEl = vm && vm.$el ? vm.$el : document;
    const $scope = $(scopeEl);
    const uid = vm && vm._uid ? vm._uid : "default";
    const ns = `.jx3boxElement_${uid}`;
    let lastTappedElement = null;
    const debugPop = false;

    const isMobile = () => {
        if (typeof window === "undefined") return false;

        const coarsePointer =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const hasTouchEvent = "ontouchstart" in window;
        const mobileUA =
            typeof navigator !== "undefined" &&
            /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");

        return coarsePointer || (hasTouchEvent && mobileUA);
    };

    const cachedPop =
        vm &&
        vm.__jx3ElementPop &&
        vm.__jx3ElementPop.length &&
        document.documentElement.contains(vm.__jx3ElementPop[0])
            ? vm.__jx3ElementPop
            : null;
    const $pop = cachedPop || $scope.find(pop_class).first();

    if (!$pop.length) return;
    if (isMobile() && vm) {
        vm.__jx3ElementPop = $pop;
        if ($pop.parent()[0] !== document.body) {
            $pop.appendTo(document.body);
        }
    }

    const getCurrentTarget = (el, e) => {
        const $self = $(el).closest(selector);
        if ($self.length) return $self;
        return $(e.currentTarget || e.target).closest(selector);
    };

    const getDataTarget = ($target, e) => {
        const $eventTarget = $(e?.target);
        const $fromEvent = $eventTarget.closest("[data-type]");
        if ($fromEvent.length && $target.has($fromEvent).length) return $fromEvent;
        if ($target.attr("data-type")) return $target;

        return $target.find("[data-type]").first();
    };

    const getHrefTarget = ($target) => {
        if ($target.is("a[href]")) return $target;
        return $target.closest("a[href]");
    };

    const syncElementData = ($dataTarget, $targetForFallback = null) => {
        let type = $dataTarget.attr("data-type");
        if (!type && $targetForFallback && $targetForFallback.length) {
            const $fallback = $targetForFallback.attr("data-type")
                ? $targetForFallback
                : $targetForFallback.find("[data-type]").first();
            type = $fallback.attr("data-type");
            if ($fallback.length) $dataTarget = $fallback;
        }
        if (!type) return "";

        if (type === "item") {
            vm.item.id = $dataTarget.attr("data-id");
            vm.item.client = $dataTarget.attr("data-client") == "origin" ? 2 : 1;
        } else if (type === "author") {
            vm.author.id = $dataTarget.attr("data-id");
        } else if (type === "emotion") {
            vm.emotion.id = $dataTarget.attr("data-id");
        } else if (vm[type]) {
            vm[type].client = $dataTarget.attr("data-client");
            vm[type].id = $dataTarget.attr("data-id");
            vm[type].level = $dataTarget.attr("data-level");
        }

        vm.jx3_element.type = type;
        return type;
    };

    const showPop = ($dataTarget, point = {}, $targetForRect = null) => {
        clearTimeout(outer);
        clearTimeout(inner);

        const type = syncElementData($dataTarget, $targetForRect);
        if (!type) return;

        const fallbackRect = $targetForRect && $targetForRect.length ? $targetForRect[0].getBoundingClientRect() : null;
        const fallbackX = fallbackRect ? fallbackRect.left + fallbackRect.width / 2 : 0;
        const fallbackY = fallbackRect ? fallbackRect.top + fallbackRect.height / 2 : 0;
        const clientX = Number(point.clientX ?? fallbackX ?? 0);
        const clientY = Number(point.clientY ?? fallbackY ?? 0);

        vm.jx3_element.style.display = "block";
        vm.jx3_element.style.position = "fixed";
        vm.jx3_element.style.zIndex = "99999";
        $pop.stop(true, true).fadeIn(120);

        const selfHeight = $pop.height();
        const winHeight = window.innerHeight;
        const currentY = clientY;
        let willStayY = clientY + 10;

        if (selfHeight && winHeight - currentY < selfHeight) {
            willStayY = currentY - (selfHeight - (winHeight - currentY)) - 100;
        }

        const maxLeft = Math.max(0, window.innerWidth - ($pop.outerWidth() || 0) - 12);
        vm.jx3_element.style.left = Math.max(0, Math.min(clientX + 10, maxLeft)) + "px";
        vm.jx3_element.style.top = Math.max(0, willStayY) + "px";

        if (debugPop && isMobile()) {
            vm.jx3_element.style.left = "50%";
            vm.jx3_element.style.top = "52%";
            vm.jx3_element.style.transform = "translate(-50%, -50%)";
            vm.jx3_element.style.zIndex = "99999";
            vm.jx3_element.style.background = "rgba(0,0,0,0.88)";
            vm.jx3_element.style.outline = "2px solid #00e5ff";
            vm.jx3_element.style.maxHeight = "72vh";
            vm.jx3_element.style.overflow = "auto";
        } else {
            vm.jx3_element.style.transform = "";
            vm.jx3_element.style.background = "";
            vm.jx3_element.style.outline = "";
            vm.jx3_element.style.maxHeight = "";
            vm.jx3_element.style.overflow = "";
        }
    };

    const hidePop = () => {
        vm.jx3_element.style.display = "none";
        $pop.stop(true, true).fadeOut(120);
    };

    // 触发时
    $scope.off(ns);
    $pop.off(ns);
    $(document).off(ns);

    $scope.on(`mouseenter${ns}`, selector, function (e) {
        if (isMobile()) return;
        const $target = getCurrentTarget(this, e);
        const $dataTarget = getDataTarget($target, e);
        showPop($dataTarget, e, $target);
    });

    // 移除时
    $scope.on(`mouseleave${ns}`, selector, function () {
        if (isMobile()) return;
        outer = setTimeout(() => {
            hidePop();
        }, 380);
    });

    $scope.on(`click${ns}`, selector, function (e) {
        if (!isMobile()) return;

        const $target = getCurrentTarget(this, e);
        const $dataTarget = getDataTarget($target, e);
        if (!$dataTarget.length) return;

        const $hrefTarget = getHrefTarget($target);
        const href = String($hrefTarget.attr("href") || "");
        const touch = e.originalEvent?.touches?.[0] || e.originalEvent?.changedTouches?.[0];
        const point = touch || e;
        const tappedElement = $target.get(0);

        if (href && lastTappedElement === tappedElement) {
            lastTappedElement = null;
            hidePop();
            return;
        }

        e.preventDefault();
        lastTappedElement = tappedElement;
        showPop($dataTarget, point, $target);
    });

    // POP内停留
    $pop.on(`mouseenter${ns}`, function () {
        if (isMobile()) return;
        clearTimeout(outer);
        vm.jx3_element.style.display = "block";
        $pop.stop(true, true).fadeIn(120);
    });
    $pop.on(`mouseleave${ns}`, function () {
        if (isMobile()) return;
        clearTimeout(inner);
        inner = setTimeout(() => {
            hidePop();
        }, 280);
    });

    $(document).on(`click${ns}`, function (e) {
        if (!isMobile()) return;
        const $target = $(e.target);
        const $trigger = $target.closest(selector);
        const isCurrentTrigger = $trigger.length && ($trigger[0] === scopeEl || $scope.has($trigger[0]).length);

        if (isCurrentTrigger || $target.closest(pop_class).length) return;

        lastTappedElement = null;
        hidePop();
    });
}

export default renderItem;
