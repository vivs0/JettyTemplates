package com.b3ds.ifarm.configuration;
import javax.swing.text.html.HTML;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

@org.springframework.context.annotation.Configuration
@EnableWebMvc
@ComponentScan({"com.b3ds.ifarm.controller"})
public class WebMvcConfig extends WebMvcConfigurerAdapter{
	private final static Logger logger = LogManager.getLogger(WebMvcConfig.class);
	

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("/app/").setCachePeriod(31556926);        
    }

    @Bean
    public ViewResolver getViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/View/");
        resolver.setSuffix(".html");
        resolver.setOrder(1);
        return resolver;
    }

/*    @Bean
    public InternalResourceViewResolver getFreemarkerConfig() {
        FreeMarkerConfigurer result = new FreeMarkerConfigurer();
        result.setTemplateLoaderPath("/pages/");
        return result;
    }   
    
    @Bean
    public InternalResourceViewResolver getInternalResourceViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/pages/");
        resolver.setSuffix(".jsp");
        resolver.setOrder(2);
        return resolver;
    }*/
}
