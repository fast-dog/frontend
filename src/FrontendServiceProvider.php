<?php

namespace FastDog\Frontend;


use Illuminate\Support\ServiceProvider as LaravelServiceProvider;

/**
 * Class FrontendServiceProvider
 *
 * @package FastDog\Frontend
 * @version 0.1.0
 * @author Андрей Мартынов <d.g.dev482@gmail.com>
 */
class FrontendServiceProvider extends LaravelServiceProvider
{
    const NAME = 'frontend';

    /**
     * php composer.phar update fast_dog_core:dev-master --prefer-source
     *
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot(): void
    {
        $this->handleViews();
    }


    /**
     * Определение представлении пакета (шаблонов по умолчанию)
     */
    private function handleViews(): void
    {
        $this->publishes([__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR =>
            public_path('vendor/fast_dog/' . self::NAME)], 'public');

        $this->publishes([__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR .
        'assets' =>
            public_path('vendor/fast_dog/' . self::NAME)], 'public');

        $this->publishes([__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'ckeditor' . DIRECTORY_SEPARATOR .
        'assets' => public_path('ckeditor/')], 'public');
    }
}