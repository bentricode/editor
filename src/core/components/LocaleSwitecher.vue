<template>
    <div class="locale-switcher fica-na-direita">
        <div class="locale-changer fica-na-direita">
            <select v-model="$i18n.locale" class="form-select fica-na-direita">
                <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
                    {{ locale }}
                </option>
            </select>
        </div>
    </div>
</template>