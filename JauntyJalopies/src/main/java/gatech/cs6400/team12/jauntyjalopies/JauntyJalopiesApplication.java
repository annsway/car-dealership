package gatech.cs6400.team12.jauntyjalopies;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class JauntyJalopiesApplication {
    private static final Logger logger = LoggerFactory.getLogger(JauntyJalopiesApplication.class);

    public static void main(String[] args) {

        ApplicationContext ctx = SpringApplication.run(JauntyJalopiesApplication.class, args);
//        String[] beanNames = ctx.getBeanDefinitionNames();
//        for (String beanName : beanNames) {
//            logger.info(beanName);
//        }
    }
}
